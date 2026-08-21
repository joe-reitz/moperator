import * as React from "react";

interface NewPostEmailProps {
  postTitle: string;
  postExcerpt: string;
  postUrl: string;
  postImage?: string;
  unsubscribeUrl: string;
}

export default function NewPostEmail({
  postTitle,
  postExcerpt,
  postUrl,
  postImage,
  unsubscribeUrl,
}: NewPostEmailProps) {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: "#070a08",
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }}
      >
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
          <tr>
            <td
              style={{
                padding: "32px 24px",
                borderBottom: "1px solid #1e2b20",
              }}
            >
              <table role="presentation" style={{ width: "100%" }}>
                <tr>
                  <td>
                    <span
                      style={{
                        fontSize: "24px",
                        fontWeight: 600,
                        color: "#e6f2e8",
                      }}
                    >
                      The{" "}
                      <span style={{ color: "#3ee07f" }}>m</span>
                      Operator
                    </span>
                  </td>
                </tr>
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
                  textTransform: "uppercase",
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
                href={unsubscribeUrl}
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
        </table>
      </body>
    </html>
  );
}

