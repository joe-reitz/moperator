import { client } from "@/sanity/lib/client";
import { redirect } from "next/navigation";

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

export default async function PreviewEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ slug?: string; key?: string }>;
}) {
  const { slug: postSlug, key } = await searchParams;

  // Simple auth check in production
  if (process.env.NODE_ENV === "production") {
    if (key !== process.env.NOTIFICATION_API_KEY) {
      redirect("/");
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
  const postTitle = post?.title || "How to Build AI Apps with Cursor: A Complete Guide";
  const postExcerpt = post?.excerpt || "Learn how to leverage AI-assisted development to ship applications faster than ever. This step-by-step guide covers everything from setup to deployment.";
  const postUrl = post 
    ? `https://the-moperator.com/blog/${post.slug.current}`
    : "https://the-moperator.com/blog/example-post";
  const postImage = post?.mainImage?.asset?.url;

  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Email Preview</title>
      </head>
      <body
        style={{
          margin: 0,
          padding: "40px 20px",
          backgroundColor: "#070a08",
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }}
      >
        {/* Preview banner */}
        <div
          style={{
            maxWidth: "600px",
            margin: "0 auto 20px",
            padding: "12px 16px",
            backgroundColor: "#3ee07f",
            borderRadius: "8px",
            color: "#070a08",
            fontSize: "14px",
            fontWeight: 500,
            textAlign: "center" as const,
          }}
        >
          📧 Email Preview {post ? `— "${post.title}"` : "— Demo Content"}
        </div>

        {/* Email content */}
        <table
          role="presentation"
          style={{
            width: "100%",
            maxWidth: "600px",
            margin: "0 auto",
            backgroundColor: "#0e140f",
            borderRadius: "12px",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <tbody>
            <tr>
              <td
                style={{
                  padding: "32px 24px",
                  borderBottom: "1px solid #1e2b20",
                }}
              >
                <table role="presentation" style={{ width: "100%" }}>
                  <tbody>
                    <tr>
                      <td>
                        <span
                          style={{
                            fontSize: "24px",
                            fontWeight: 600,
                            color: "#e6f2e8",
                          }}
                        >
                          The <span style={{ color: "#3ee07f" }}>m</span>
                          Operator
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>

            {/* Content */}
            <tr>
              <td style={{ padding: "32px 24px" }}>
                <p
                  style={{
                    margin: "0 0 8px 0",
                    fontSize: "12px",
                    textTransform: "uppercase" as const,
                    letterSpacing: "2px",
                    color: "#3ee07f",
                  }}
                >
                  New Post
                </p>
                <h1
                  style={{
                    margin: "0 0 16px 0",
                    fontSize: "28px",
                    fontWeight: 700,
                    color: "#e6f2e8",
                    lineHeight: 1.3,
                  }}
                >
                  {postTitle}
                </h1>
                <p
                  style={{
                    margin: "0 0 24px 0",
                    fontSize: "16px",
                    lineHeight: 1.6,
                    color: "#9ca3af",
                  }}
                >
                  {postExcerpt}
                </p>

                {/* Post Image */}
                {postImage && (
                  <img
                    src={postImage}
                    alt={postTitle}
                    style={{
                      width: "100%",
                      height: "auto",
                      borderRadius: "8px",
                      marginBottom: "24px",
                    }}
                  />
                )}

                {/* CTA Button */}
                <table role="presentation">
                  <tbody>
                    <tr>
                      <td
                        style={{
                          borderRadius: "8px",
                          background:
                            "#3ee07f",
                        }}
                      >
                        <a
                          href={postUrl}
                          style={{
                            display: "inline-block",
                            padding: "14px 28px",
                            fontSize: "16px",
                            fontWeight: 600,
                            color: "#070a08",
                            textDecoration: "none",
                          }}
                        >
                          Read the Full Post →
                        </a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>

            {/* Footer */}
            <tr>
              <td
                style={{
                  padding: "24px",
                  borderTop: "1px solid #1e2b20",
                  textAlign: "center" as const,
                }}
              >
              <p
                style={{
                  margin: "0 0 8px 0",
                  fontSize: "14px",
                  color: "#6e8a76",
                }}
              >
                You&apos;re receiving this because you subscribed to The
                mOperator.
              </p>
              <p style={{ margin: "0 0 8px 0", fontSize: "12px", color: "#4b5563" }}>
                © 2026 Joe Reitz. All rights reserved.
              </p>
              <a
                href="#"
                style={{
                  fontSize: "12px",
                  color: "#6e8a76",
                  textDecoration: "underline",
                }}
              >
                Unsubscribe
              </a>
              </td>
            </tr>
          </tbody>
        </table>
      </body>
    </html>
  );
}

