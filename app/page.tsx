import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/auth/signin");
  }
  redirect(`/${user?.id}`);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24"></main>
  );
}
