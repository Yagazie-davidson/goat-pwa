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
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head />
      <body className={`antialiased`}>{children}</body>
    </html>
  );
}
