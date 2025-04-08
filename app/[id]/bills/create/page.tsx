import BackButton from "@/components/BackButton";
import React from "react";
import { NewBillForm } from "./NewBillForm";
import { createClient } from "@/lib/supabase/server";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const supabase = await createClient();
  const { data: userData } = await supabase
    .from("users")
    .select("*")
    .eq("auth_id", id.toString());
  const { data: houseData } = await supabase
    .from("users")
    .select("*")
    // @ts-ignore
    .eq("house_id", userData[0].house_id)
    .neq("auth_id", id.toString());
  userData && console.log(userData[0].auth_id);
  return (
    <main className="flex min-h-screen flex-col relative items-center justify-start px-3 py-6 md:p-24 bg-[#121212] text-[#FDFDFD]">
      <div className="max-w-md w-full h-full space-y-8">
        <div className="grid grid-cols-3 items-start">
          <BackButton />
          <h2 className="font-bold text-center">New Bill</h2>
          {/* <div className="flex justify-end mr-3 items-center">
            <Link href="create">
              <Plus />
            </Link>
          </div> */}
        </div>
        {houseData && userData && (
          <NewBillForm issuer_id={userData[0].auth_id} housemates={houseData} />
        )}
      </div>
    </main>
  );
};

export default page;
