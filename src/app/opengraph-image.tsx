import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "The MOPerator - Everybody Ships";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  // Fetch the icon SVG
  const iconData = await fetch(
    new URL("../../public/icon.svg", import.meta.url)
  ).then((res) => res.text());

  // Convert SVG to data URL
  const iconDataUrl = `data:image/svg+xml;base64,${Buffer.from(iconData).toString("base64")}`;

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
          {/* Crossed mops icon */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              filter: "drop-shadow(0 0 60px rgba(245, 158, 11, 0.5))",
            }}
          >
            <img
              src={iconDataUrl}
              width="200"
              height="200"
              style={{
                width: "200px",
                height: "200px",
              }}
            />
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
              fontSize: "32px",
              color: "#6b7280",
              letterSpacing: "0.1em",
              fontWeight: "500",
            }}
          >
            Everybody Ships.
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

