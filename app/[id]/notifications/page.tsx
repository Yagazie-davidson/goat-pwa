import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowUp,
  BadgeAlert,
  Bell,
  Logs,
  ReceiptIcon,
  SquareKanban,
} from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import RecentBills from "../RecentBills";
import BackButton from "@/components/BackButton";

export default async function page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: tagsData, error: tagsError } = await supabase
    .from("tags")
    .select("*")
    .eq("issuer_id", id.toString())
    .eq("status", "verifying")
    .neq("housemate_id", id.toString());

  console.log(tagsData);
  console.log(tagsError);

  return (
    <main className="flex min-h-screen flex-col items-center justify-start px-4 py-6 md:p-24 bg-[#121212] text-[#FDFDFD]">
      <div className="max-w-md w-full h-full space-y-8">
        <BackButton />

        <div>
          <p className="mt-5 text-lg font-bold">
            {/* You no go owe ke? */}
            Notifications
          </p>
          <RecentBills tags={tagsData} />
        </div>
      </div>
    </main>
  );
}
