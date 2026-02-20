import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CryptoWordle 🔗",
  description: "Daily crypto word puzzle — guess the 5-letter crypto term in 6 tries!",
  other: {
    "fc:frame": "vNext",
    "fc:miniapp": "true",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="theme-color" content="#0a0a0f" />
      </head>
      <body className="grid-bg min-h-screen">{children}</body>
    </html>
  );
}
