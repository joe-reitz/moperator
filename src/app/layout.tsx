import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "The mOperator | AI App Development for Marketing Ops",
  description:
    "Learn to build AI-powered applications with tools like Cursor and v0. A resource hub for Marketing Operations professionals breaking into AI development.",
  keywords: [
    "Marketing Operations",
    "AI Development",
    "Cursor",
    "v0",
    "No-Code",
    "Low-Code",
    "MarTech",
  ],
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: "/icon.svg",
  },
  metadataBase: new URL("https://the-moperator.com"),
  alternates: {
    types: {
      "application/rss+xml": [{ url: "/feed.xml", title: "The mOperator" }],
    },
  },
  openGraph: {
    title: "The mOperator",
    description: "AI App Development for Marketing Ops Professionals",
    type: "website",
    siteName: "The mOperator",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "The mOperator",
    description: "AI App Development for Marketing Ops Professionals",
    creator: "@joe_reitz",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
