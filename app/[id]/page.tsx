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
import RecentBills from "./RecentBills";
import Greeting from "./Greeting";
import Balance from "./Balance";
import Link from "next/link";
import SaveHouseId from "./SaveHouseId";

export default async function page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: userData } = await supabase
    .from("users")
    .select("*")
    .eq("auth_id", id.toString());
  const { data: tagsData } = await supabase
    .from("tags")
    .select("*")
    .eq("housemate_id", id.toString())
    .neq("issuer_id", id.toString());
  const { data: tagsNotfication } = await supabase
    .from("tags")
    .select("*")
    .eq("issuer_id", id.toString())
    .eq("status", "verifying")
    .neq("housemate_id", id.toString());
  // const { data: accountsData } = await supabase
  //   .from("accounts")
  //   .select("*")
  //   .eq("user_id", id.toString());

  // console.log({ tagsData, account: accountsData[0] });

  return (
    <main className="flex min-h-screen flex-col items-center justify-start px-4 py-6 md:p-24 bg-[#121212] text-[#FDFDFD]">
      <div className="max-w-md w-full h-full space-y-8">
        {userData && <SaveHouseId id={userData[0].house_id} />}
        {userData && tagsNotfication && (
          <Greeting
            username={userData[0].username}
            id={id}
            notfication={tagsNotfication?.length}
          />
        )}
        {userData && <Balance amount_owe={userData[0].amount_owe} />}
        <div className="flex items-center justify-between space-x-10">
          <Link
            href={`/`}
            className="flex items-center justify-center bg-[#1C1C1E] shadow-md rounded-sm space-x-4 w-full max-w-1/2 py-2"
          >
            <ArrowUp size={22} />
            <p className="font-bold text-base">Pay</p>
          </Link>
          <Link
            href={`${id}/bills/create`}
            className="flex items-center justify-center bg-[#1C1C1E] shadow-md rounded-sm space-x-4 w-full max-w-1/2 py-2"
          >
            <ReceiptIcon size={22} />
            <p className="font-bold text-base">New Bill</p>
          </Link>
        </div>
        <div className="grid grid-cols-4 gap-x-3 mt-5">
          <button className="flex flex-col bg-[#1C1C1E] items-center justify-center shadow-xl rounded-sm  p-2">
            <ArrowUp size={20} />
            <p className="font-bold text-sm">Pay Bill</p>
          </button>
          <button className="flex flex-col bg-[#1C1C1E] items-center justify-center shadow-xl rounded-sm  p-2">
            <BadgeAlert size={20} />
            <p className="font-bold text-sm">New Bill</p>
          </button>
          <button className="flex flex-col bg-[#1C1C1E] items-center justify-center shadow-xl rounded-sm  p-2">
            {/* <p className="font-bold textsm">Coming Soon</p> */}
            <SquareKanban size={20} />
            <p className="font-bold text-sm">Board</p>
          </button>
          <button className="flex flex-col bg-[#1C1C1E] items-center justify-center shadow-xl rounded-sm  p-2">
            <Logs size={20} />
            <p className="font-bold text-sm">Logs</p>
          </button>
        </div>
        <div>
          <p className="mt-5 text-lg font-bold">
            {/* You no go owe ke? */}
            Recent Bills
          </p>
          <div className="bg-[#1C1C1E] rounded-sm p-1">
            <RecentBills tags={tagsData} />
          </div>
        </div>
      </div>
    </main>
  );
}
