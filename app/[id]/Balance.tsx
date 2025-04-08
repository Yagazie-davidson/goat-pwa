"use client";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Props = {
  amount_owe: number;
};
const Balance = ({ amount_owe }: Props) => {
  return (
    <div>
      <Tabs defaultValue="owed" className="w-[400px]">
        <TabsList className="p-0">
          <TabsTrigger
            value="owed"
            className="text-[12px] font-bold p-1 data-[state=active]:bg-[#1C1C1E] data-[state=active]:text-[#FDFDFD]"
          >
            Owed
          </TabsTrigger>
          <TabsTrigger
            value="balance"
            className="text-[12px] font-bold p-1 data-[state=active]:bg-[#1C1C1E] data-[state=active]:text-[#FDFDFD]"
          >
            Balance
          </TabsTrigger>
        </TabsList>
        <TabsContent value="owed">
          <div className="text-left">
            <p className="text-sm font-semibold text-muted-foreground mb-5">
              {amount_owe > 0
                ? "You no go owe ke?"
                : "Hmm... You're not owing, Strange 👀"}
            </p>
            <h4 className="text-4xl font-bold tracking-tight">
              <span className="mr-1">₦</span>
              {amount_owe.toFixed(2)}
            </h4>
            <p className="text-xs font-semibold text-muted-foreground">
              Last Updated
            </p>
          </div>
        </TabsContent>
        <TabsContent value="balance">
          <div className="text-left">
            <p className=" text-sm font-semibold text-muted-foreground mb-5">
              Money outside
            </p>
            <h4 className="text-4xl font-bold tracking-tight">
              <span className="mr-1">₦</span>
              0.00
            </h4>
            <p className="text-xs font-semibold text-muted-foreground">
              Last Updated
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Balance;
