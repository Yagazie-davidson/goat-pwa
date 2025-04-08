import BackButton from "@/components/BackButton";
import React from "react";
// import { createClient } from "@/lib/supabase/server";
import { NewAccountForm } from "./NewAccountForm";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  // const supabase = await createClient();
  //   const { data: userData } = await supabase
  //     .from("users")
  //     .select("*")
  //     .eq("auth_id", id.toString());
  return (
    <main className="flex min-h-screen flex-col relative items-center justify-start px-3 py-6 md:p-24 bg-[#121212] text-[#FDFDFD]">
      <div className="max-w-md w-full h-full space-y-8">
        <div className="grid grid-cols-3 items-start">
          <BackButton />
          <h2 className="font-bold text-center">Update Account Info</h2>
        </div>
        <NewAccountForm user_id={id} />
      </div>
    </main>
  );
};

export default page;
