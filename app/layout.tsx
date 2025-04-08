import type { Metadata } from "next";
import "./globals.css";
// import { Ojuju } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { myFont } from "./fonts";
// const ojuju = Ojuju({
//   subsets: ["latin"],
//   display: "swap",
// });
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
      <body
        className={`antialiased ${myFont.className} bg-[#121212] text-[#FDFDFD]`}
      >
        <Toaster />
        {children}
      </body>
    </html>
  );
}
