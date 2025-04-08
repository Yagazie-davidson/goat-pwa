import Navbar from "@/components/navbar";
// import "./globals.css";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { myFont } from "../fonts";
import { Toaster } from "@/components/ui/sonner";

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}>) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/auth/signin");
  }
  return (
    <html lang="en">
      <head>
        <link rel="/manifest.ts"></link>
      </head>
      <body
        className={`antialiased bg-[#121212] text-[#FDFDFD] ${myFont.className}`}
      >
        <div className="text-[#121212] bg-[#FDFDFD]">
          <Toaster />
        </div>
        {children} <Navbar userId={id} />
      </body>
    </html>
  );
}
