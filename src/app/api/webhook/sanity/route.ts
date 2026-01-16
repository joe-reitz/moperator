import { client } from "@/sanity/lib/client";
import { writeClient } from "@/sanity/lib/writeClient";
import { Resend } from "resend";
import { NextResponse } from "next/server";
import NewPostEmail from "@/emails/NewPostEmail";
import crypto from "crypto";

// Ensure Node.js runtime (not Edge)
export const runtime = "nodejs";

// Lazy initialization
let resend: Resend | null = null;
function getResend() {
  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

// Timing-safe comparison
function safeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

// Verify Sanity webhook signature
function isValidSignature(body: string, signature: string | null): boolean {
  const secret = process.env.SANITY_WEBHOOK_SECRET?.trim();

  if (!signature || !secret) {
    console.log("Webhook: Missing signature or secret", {
      hasSignature: !!signature,
      hasSecret: !!secret,
      secretLength: secret?.length
    });
    return false;
  }

  let cleanSig = signature.trim();

  // Handle Stripe-style format: "t=<timestamp>,v1=<signature>"
  if (cleanSig.includes("t=") && cleanSig.includes(",v1=")) {
    const parts = cleanSig.split(",v1=");
    if (parts.length === 2) {
      cleanSig = parts[1]; // Extract just the signature part
    }
  }

  // Remove other common prefixes
  if (cleanSig.startsWith("sha256=")) cleanSig = cleanSig.slice(7);
  if (cleanSig.startsWith("sha1=")) cleanSig = cleanSig.slice(5);

  // Try SHA-256 with base64 encoding (Sanity's current format)
  const sha256Base64 = crypto.createHmac("sha256", secret).update(body).digest("base64");
  if (safeCompare(cleanSig, sha256Base64)) {
    console.log("Webhook: Signature valid (SHA-256 base64)");
    return true;
  }

  // Try SHA-1 with base64 encoding
  const sha1Base64 = crypto.createHmac("sha1", secret).update(body).digest("base64");
  if (safeCompare(cleanSig, sha1Base64)) {
    console.log("Webhook: Signature valid (SHA-1 base64)");
    return true;
  }

  // Try SHA-256 hex (older format)
  const sha256Hex = crypto.createHmac("sha256", secret).update(body).digest("hex");
  if (safeCompare(cleanSig, sha256Hex)) {
    console.log("Webhook: Signature valid (SHA-256 hex)");
    return true;
  }

  // Try SHA-1 hex (older format)
  const sha1Hex = crypto.createHmac("sha1", secret).update(body).digest("hex");
  if (safeCompare(cleanSig, sha1Hex)) {
    console.log("Webhook: Signature valid (SHA-1 hex)");
    return true;
  }

  const debugInfo = {
    originalSignature: signature,
    cleanedSignature: cleanSig,
    receivedLength: cleanSig.length,
    sha256Base64: sha256Base64.substring(0, 20) + "...",
    sha1Base64: sha1Base64.substring(0, 20) + "...",
  };

  console.log("Webhook: Signature mismatch", debugInfo);

  // Store debug info for error response
  (global as any).__lastSignatureDebug = debugInfo;

  return false;
}

type Subscriber = {
  email: string;
};

type Post = {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt: string | null;
  publishedAt: string | null;
  notificationSent: boolean | null;
  mainImage: {
    asset: {
      url: string;
    };
  } | null;
};

export async function POST(request: Request) {
  try {
    const body = await request.text();
    
    // Try all possible header names Sanity might use
    const signature = 
      request.headers.get("x-sanity-signature") ||
      request.headers.get("sanity-webhook-signature") || 
      request.headers.get("x-sanity-webhook-signature") ||
      request.headers.get("x-webhook-signature");

    // Log headers for debugging
    const headers = Object.fromEntries(request.headers.entries());
    console.log("Webhook received:", {
      headers,
      bodyLength: body.length,
      bodyPreview: body.substring(0, 100),
    });

    // Verify webhook signature
    if (!isValidSignature(body, signature)) {
      console.error("Invalid webhook signature");
      const debugInfo = (global as any).__lastSignatureDebug;
      return NextResponse.json({
        error: "Invalid signature",
        debug: debugInfo,
        headers: {
          "x-sanity-signature": request.headers.get("x-sanity-signature"),
          "sanity-webhook-signature": request.headers.get("sanity-webhook-signature"),
          "x-sanity-webhook-signature": request.headers.get("x-sanity-webhook-signature"),
          "x-webhook-signature": request.headers.get("x-webhook-signature"),
        }
      }, { status: 401 });
    }

    const payload = JSON.parse(body);

    // Only process post documents
    if (payload._type !== "post") {
      return NextResponse.json({ message: "Not a post, skipping" }, { status: 200 });
    }

    // Fetch the full post data
    const post: Post | null = await client.fetch(
      `*[_type == "post" && _id == $id][0] {
        _id,
        title,
        slug,
        excerpt,
        publishedAt,
        notificationSent,
        mainImage {
          asset-> {
            url
          }
        }
      }`,
      { id: payload._id }
    );

    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 200 });
    }

    // Check if we should send notification
    // - Must have publishedAt date
    // - publishedAt must be in the past (or now)
    // - notificationSent must be false/null
    if (!post.publishedAt) {
      return NextResponse.json({ message: "No publish date, skipping" }, { status: 200 });
    }

    const publishDate = new Date(post.publishedAt);
    const now = new Date();

    if (publishDate > now) {
      return NextResponse.json({ message: "Future publish date, skipping" }, { status: 200 });
    }

    if (post.notificationSent) {
      return NextResponse.json({ message: "Notification already sent" }, { status: 200 });
    }

    // Fetch all active subscribers
    const subscribers: Subscriber[] = await client.fetch(
      `*[_type == "subscriber" && active == true] { email }`
    );

    if (subscribers.length === 0) {
      return NextResponse.json({ message: "No subscribers to notify" }, { status: 200 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://the-moperator.com";
    const postUrl = `${baseUrl}/blog/${post.slug.current}`;

    // Helper to delay between sends (Resend free tier: 2 requests/second)
    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    // Send emails
    let sent = 0;
    const errors: string[] = [];
    const resendClient = getResend();

    for (let i = 0; i < subscribers.length; i++) {
      const subscriber = subscribers[i];
      const encodedEmail = Buffer.from(subscriber.email).toString("base64");
      const unsubscribeUrl = `${baseUrl}/api/unsubscribe?email=${encodedEmail}`;

      try {
        const result = await resendClient.emails.send({
          from: "The MOPerator <noreply@the-moperator.com>",
          to: subscriber.email,
          subject: `New Post: ${post.title}`,
          react: NewPostEmail({
            postTitle: post.title,
            postExcerpt: post.excerpt || "Check out our latest content!",
            postUrl,
            postImage: post.mainImage?.asset?.url,
            unsubscribeUrl,
          }),
        });

        if (result.error) {
          errors.push(`${subscriber.email}: ${result.error.message}`);
        } else {
          sent++;
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        errors.push(`${subscriber.email}: ${errorMessage}`);
      }

      // Rate limiting: wait 600ms between sends
      if (i < subscribers.length - 1) {
        await delay(600);
      }
    }

    // Mark notification as sent
    if (sent > 0) {
      await writeClient.patch(post._id).set({ notificationSent: true }).commit();
    }

    console.log(`Webhook: Sent ${sent}/${subscribers.length} notifications for "${post.title}"`);

    return NextResponse.json({
      message: `Notifications sent to ${sent} of ${subscribers.length} subscribers`,
      postTitle: post.title,
      sent,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}


