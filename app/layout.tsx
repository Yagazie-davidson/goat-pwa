import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Goat",
  description: "Goat",
  manifest: "/manifest.json",
  themeColor: "#000000",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Next.js PWA",
    startupImage: ["/apple-splash-1125-2436.png"],
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-touch-icon": "/apple-icon-180.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="/manifest.ts"></link>
      </head>
      <body className={`antialiased`}>{children}</body>
    </html>
  );
}
