import { client } from "@/sanity/lib/client";
import { Resend } from "resend";
import { NextResponse } from "next/server";
import NewPostEmail from "@/emails/NewPostEmail";

// Lazy initialization to avoid build-time errors
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
  title: string;
  slug: { current: string };
  excerpt: string | null;
  publishedAt: string | null;
  mainImage: {
    asset: {
      url: string;
    };
  } | null;
};

export async function POST(request: Request) {
  try {
    // Verify the request is authorized (simple API key check)
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.NOTIFICATION_API_KEY}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { postSlug } = await request.json();

    if (!postSlug) {
      return NextResponse.json(
        { error: "Post slug is required" },
        { status: 400 }
      );
    }

    // Fetch the post
    const post: Post | null = await client.fetch(
      `*[_type == "post" && slug.current == $slug][0] {
        title,
        slug,
        excerpt,
        publishedAt,
        mainImage {
          asset-> {
            url
          }
        }
      }`,
      { slug: postSlug }
    );

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Fetch all active subscribers
    const subscribers: Subscriber[] = await client.fetch(
      `*[_type == "subscriber" && active == true] { email }`
    );

    if (subscribers.length === 0) {
      return NextResponse.json(
        { message: "No active subscribers to notify" },
        { status: 200 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://the-moperator.com";
    const postUrl = `${baseUrl}/blog/${post.slug.current}`;

    // Send emails in batches (Resend allows batch sending)
    const emails = subscribers.map((subscriber) => {
      // Encode email for unsubscribe link
      const encodedEmail = Buffer.from(subscriber.email).toString("base64");
      const unsubscribeUrl = `${baseUrl}/api/unsubscribe?email=${encodedEmail}`;

      return {
        from: "The mOperator <noreply@the-moperator.com>",
        to: subscriber.email,
        subject: `New Post: ${post.title}`,
        react: NewPostEmail({
          postTitle: post.title,
          postExcerpt: post.excerpt || "Check out our latest content!",
          postUrl,
          postImage: post.mainImage?.asset?.url,
          unsubscribeUrl,
        }),
      };
    });

    // Helper to delay between sends (Resend free tier: 2 requests/second)
    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    // Send emails individually with rate limiting
    let sent = 0;
    const errors: string[] = [];
    const resendClient = getResend();

    for (let i = 0; i < emails.length; i++) {
      const email = emails[i];
      try {
        const result = await resendClient.emails.send(email);
        if (result.error) {
          console.error(`Failed to send to ${email.to}:`, result.error);
          errors.push(`${email.to}: ${result.error.message}`);
        } else {
          sent++;
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.error(`Failed to send to ${email.to}:`, errorMessage);
        errors.push(`${email.to}: ${errorMessage}`);
      }

      // Wait 600ms between emails to stay under 2/second rate limit
      if (i < emails.length - 1) {
        await delay(600);
      }
    }

    return NextResponse.json({
      message: `Notifications sent to ${sent} of ${subscribers.length} subscribers`,
      total: subscribers.length,
      sent,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error("Send notification error:", error);
    return NextResponse.json(
      { error: "Failed to send notifications" },
      { status: 500 }
    );
  }
}

