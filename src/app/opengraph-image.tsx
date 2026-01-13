import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "The MOPerator - AI App Development for Marketing Ops";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0c0c0f 0%, #1a1a22 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {/* Background decorative circles */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-100px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            border: "1px solid rgba(245, 158, 11, 0.1)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "-50px",
            right: "-50px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            border: "1px solid rgba(245, 158, 11, 0.1)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-150px",
            left: "-150px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            border: "1px solid rgba(245, 158, 11, 0.05)",
          }}
        />

        {/* Logo area with glow */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "32px",
          }}
        >
          {/* Mop icon representation */}
          <div
            style={{
              width: "160px",
              height: "160px",
              background: "linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)",
              borderRadius: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 80px rgba(245, 158, 11, 0.4)",
            }}
          >
            <svg
              width="100"
              height="100"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#0c0c0f"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2L12 10" />
              <path d="M5 10L19 10" />
              <path d="M5 10L3 22" />
              <path d="M19 10L21 22" />
              <path d="M8 10L6 22" />
              <path d="M16 10L18 22" />
              <path d="M12 10L12 22" />
            </svg>
          </div>

          {/* Title */}
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: "8px",
            }}
          >
            <span
              style={{
                fontSize: "64px",
                fontWeight: "700",
                color: "#e8e4dd",
                letterSpacing: "-0.02em",
              }}
            >
              The
            </span>
            <span
              style={{
                fontSize: "64px",
                fontWeight: "700",
                color: "#f59e0b",
                letterSpacing: "-0.02em",
                textShadow: "0 0 40px rgba(245, 158, 11, 0.5)",
              }}
            >
              MOP
            </span>
            <span
              style={{
                fontSize: "64px",
                fontWeight: "700",
                color: "#e8e4dd",
                letterSpacing: "-0.02em",
              }}
            >
              erator
            </span>
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize: "28px",
              color: "#6b7280",
              letterSpacing: "0.05em",
            }}
          >
            AI App Development for Marketing Ops
          </div>
        </div>

        {/* Bottom accent line */}
        <div
          style={{
            position: "absolute",
            bottom: "0",
            left: "0",
            right: "0",
            height: "4px",
            background: "linear-gradient(90deg, transparent, #f59e0b, transparent)",
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  );
}

