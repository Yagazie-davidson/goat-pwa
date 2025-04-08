import React from "react";
import RecentBills from "../RecentBills";
import BackButton from "@/components/BackButton";
import { Plus } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const supabase = await createClient();

  const { data: byMe } = await supabase
    .from("tags")
    .select("*")
    .eq("issuer_id", id.toString())
    .neq("housemate_id", id.toString());
  const { data: tagged } = await supabase
    .from("tags")
    .select("*")
    .eq("housemate_id", id.toString());

  return (
    <main className="flex min-h-screen flex-col items-center justify-start px-1 py-6 md:p-24 bg-[#121212] text-[#FDFDFD]">
      <div className="max-w-md w-full h-full space-y-8">
        <div className="grid grid-cols-3 items-start">
          <BackButton />
          <h2 className="font-bold text-center">Bills History</h2>
          <div className="flex justify-end mr-3 items-center">
            <Link href="bills/create">
              <Plus />
            </Link>
          </div>
        </div>
        <Tabs defaultValue="tagged" className="w-[400px]">
          <TabsList>
            <TabsTrigger
              value="tagged"
              className="text-[16px] font-bold p-3 data-[state=active]:bg-[#1C1C1E] data-[state=active]:text-[#FDFDFD]"
            >
              Tagged
            </TabsTrigger>
            <TabsTrigger
              value="by me"
              className="text-[16px] font-bold p-3 data-[state=active]:bg-[#1C1C1E] data-[state=active]:text-[#FDFDFD]"
            >
              By me
            </TabsTrigger>
          </TabsList>
          <TabsContent value="tagged">
            <RecentBills tags={tagged} />
          </TabsContent>
          <TabsContent value="by me">
            <RecentBills tags={byMe} />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
};

export default page;
