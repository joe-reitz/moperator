import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/seo/config";

export const runtime = "edge";

export const alt = "The mOperator - Everybody Ships";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

// Phosphor mark, composed from primitives so no logo asset is needed.
// Proportions mirror src/app/components/Logo.tsx at a 4.6x scale.
const S = 4.6;

export default async function Image() {
  // Heritage ASCII crossed-mops art, used as texture only — never as the logo.
  const ascii = await fetch(
    new URL("../../public/mark-ascii-green.png", import.meta.url)
  ).then((res) => res.arrayBuffer());
  const asciiUrl = `data:image/png;base64,${Buffer.from(ascii).toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          background: "#070a08",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <img
          alt=""
          src={asciiUrl}
          width="760"
          height="541"
          style={{
            position: "absolute",
            right: "-40px",
            top: "40px",
            width: "620px",
            height: "441px",
            opacity: siteConfig.ogImage.artOpacity,
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "40px",
          }}
        >
          {/* Mark: m + ring-O + block cursor */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              filter: "drop-shadow(0 0 60px rgba(62, 224, 127, 0.35))",
            }}
          >
            <span
              style={{
                fontSize: `${30 * S}px`,
                fontWeight: 700,
                color: "#e6f2e8",
                letterSpacing: "-0.04em",
                lineHeight: 1,
              }}
            >
              m
            </span>
            <div
              style={{
                width: `${25 * S}px`,
                height: `${25 * S}px`,
                borderRadius: "50%",
                border: `${4 * S}px solid #3ee07f`,
                marginLeft: `${3 * S}px`,
                boxSizing: "border-box",
              }}
            />
            <div
              style={{
                width: `${7 * S}px`,
                height: `${19 * S}px`,
                background: "#e6f2e8",
                marginLeft: `${4 * S}px`,
              }}
            />
          </div>

          {/* Wordmark: "the m" cream, "Operator" green */}
          <div style={{ display: "flex", alignItems: "baseline" }}>
            <span
              style={{
                fontSize: "60px",
                fontWeight: 700,
                color: "#e6f2e8",
                letterSpacing: "-0.02em",
              }}
            >
              the m
            </span>
            <span
              style={{
                fontSize: "60px",
                fontWeight: 700,
                color: "#3ee07f",
                letterSpacing: "-0.02em",
                textShadow: "0 0 40px rgba(62, 224, 127, 0.5)",
              }}
            >
              Operator
            </span>
          </div>

          <div
            style={{
              fontSize: "28px",
              color: "#6e8a76",
              letterSpacing: "0.14em",
              fontWeight: 500,
              textTransform: "uppercase",
            }}
          >
            Everybody ships
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "#3ee07f",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
