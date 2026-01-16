import { client } from "@/sanity/lib/client";
import { writeClient } from "@/sanity/lib/writeClient";
import { Resend } from "resend";
import { NextResponse } from "next/server";
import NewPostEmail from "@/emails/NewPostEmail";
import { isValidSignature, SIGNATURE_HEADER_NAME } from "@sanity/webhook";

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
    const signature = request.headers.get(SIGNATURE_HEADER_NAME);
    const secret = process.env.SANITY_WEBHOOK_SECRET;

    if (!secret) {
      console.error("Webhook: SANITY_WEBHOOK_SECRET not configured");
      return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
    }

    // Verify webhook signature using official Sanity package
    const isValid = await isValidSignature(body, signature, secret);

    if (!isValid) {
      console.error("Webhook: Invalid signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    console.log("Webhook: Signature verified successfully");

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


