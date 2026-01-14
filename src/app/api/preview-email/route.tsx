import { client } from "@/sanity/lib/client";
import { NextResponse } from "next/server";
import { renderToStaticMarkup } from "react-dom/server";
import NewPostEmail from "@/emails/NewPostEmail";

type Post = {
  title: string;
  slug: { current: string };
  excerpt: string | null;
  mainImage: {
    asset: {
      url: string;
    };
  } | null;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const postSlug = searchParams.get("slug");

  // Only allow in development or with auth
  if (process.env.NODE_ENV === "production") {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.NOTIFICATION_API_KEY}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  let post: Post | null = null;

  if (postSlug) {
    post = await client.fetch(
      `*[_type == "post" && slug.current == $slug][0] {
        title,
        slug,
        excerpt,
        mainImage {
          asset-> {
            url
          }
        }
      }`,
      { slug: postSlug }
    );
  }

  // Use real post data or demo data
  const emailData = post
    ? {
        postTitle: post.title,
        postExcerpt: post.excerpt || "Check out our latest content!",
        postUrl: `https://the-moperator.com/blog/${post.slug.current}`,
        postImage: post.mainImage?.asset?.url,
      }
    : {
        postTitle: "How to Build AI Apps with Cursor: A Complete Guide",
        postExcerpt:
          "Learn how to leverage AI-assisted development to ship applications faster than ever. This step-by-step guide covers everything from setup to deployment.",
        postUrl: "https://the-moperator.com/blog/example-post",
        postImage: undefined,
      };

  const html = renderToStaticMarkup(<NewPostEmail {...emailData} />);

  return new NextResponse(`<!DOCTYPE html>${html}`, {
    headers: {
      "Content-Type": "text/html",
    },
  });
}

