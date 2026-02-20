import type { Metadata } from "next";
import "./globals.css";

const miniAppEmbed = JSON.stringify({
  version: "1",
  imageUrl: "https://crypto-wordle-mu.vercel.app/embed.png",
  button: {
    title: "🔗 Play CryptoWordle",
    action: {
      type: "launch_frame",
      name: "CryptoWordle",
      url: "https://crypto-wordle-mu.vercel.app",
      splashImageUrl: "https://crypto-wordle-mu.vercel.app/splash.png",
      splashBackgroundColor: "#0a0a0f",
    },
  },
});

export const metadata: Metadata = {
  title: "CryptoWordle 🔗",
  description: "Daily crypto word puzzle — guess the 5-letter crypto term in 6 tries!",
  openGraph: {
    title: "CryptoWordle 🔗",
    description: "Daily crypto word puzzle — guess the 5-letter crypto term in 6 tries!",
    images: ["https://crypto-wordle-mu.vercel.app/embed.png"],
  },
  other: {
    "fc:frame": miniAppEmbed,
    "fc:miniapp": miniAppEmbed,
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
