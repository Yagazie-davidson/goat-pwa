import BackButton from "@/components/BackButton";
import { createClient } from "@/lib/supabase/server";
import { Plus } from "lucide-react";
import Link from "next/link";
import React from "react";
import DisplayAccountInfo from "./DisplayAccountInfo";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const supabase = await createClient();

  const { data: userAccount } = await supabase
    .from("accounts")
    .select("*")
    .eq("user_id", id.toString());
  console.log(userAccount);
  return (
    <main className="flex min-h-screen flex-col relative items-center justify-start px-3 py-6 md:p-24 bg-[#121212] text-[#FDFDFD]">
      <div className="max-w-md w-full h-full space-y-8">
        <div className="grid grid-cols-3 items-start">
          <BackButton />
          <h2 className="font-bold text-center">Account Details</h2>
          {/* <div className="flex justify-end mr-3 items-center">
            <Link href="create">
              <Plus />
            </Link>
          </div> */}
        </div>
        <div className="flex justify-center w-full">
          <Link
            href={`account/create`}
            className="flex items-center justify-center bg-[#1C1C1E] shadow-md rounded-sm space-x-4 w-full max-w-1/2 py-2"
          >
            <p className="font-bold text-base">Update Acount Info</p>
            <Plus size={20} />
          </Link>
        </div>
        <div>
          {userAccount && (
            <DisplayAccountInfo
              account_name={userAccount[0]?.account_name}
              account_number={userAccount[0]?.account_number}
              bank_name={userAccount[0]?.bank_name}
            />
          )}
        </div>
      </div>
    </main>
  );
};

export default page;
