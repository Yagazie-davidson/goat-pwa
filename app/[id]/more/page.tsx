import BackButton from "@/components/BackButton";
import SignoutButton from "@/components/SignoutButton";
import { ChevronRight, Power } from "lucide-react";
import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <main className="flex min-h-screen flex-col relative items-center justify-start px-3 py-6 md:p-24 bg-[#121212] text-[#FDFDFD]">
      <div className="max-w-md w-full h-full space-y-8">
        <div className="grid grid-cols-3 items-start">
          <BackButton />
          <h2 className="font-bold text-center">More Actions</h2>
          {/* <div className="flex justify-end mr-3 items-center">
            <Link href="create">
              <Plus />
            </Link>
          </div> */}
        </div>
        <div className="flex flex-col space-y-3">
          <Link
            href="more/account"
            className="flex bg-[#1C1C1E] items-center justify-between py-3 px-1 rounded-sm"
          >
            <div>
              <p>Account Details</p>
            </div>
            <ChevronRight size={20} />
          </Link>
          <SignoutButton />
        </div>
      </div>
    </main>
  );
};

export default page;
