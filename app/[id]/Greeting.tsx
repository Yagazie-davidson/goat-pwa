"use client";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell } from "lucide-react";

import Link from "next/link";

type Props = {
  username: string;
  notfication: number;
  id: string;
};

const Greeting = ({ username, id, notfication }: Props) => {
  return (
    <div className="w-full top-8 z-30 origin-top h-full max-h-5 flex justify-between items-center">
      <div className="flex items-center space-x-2 ">
        <Avatar className="w-16 h-16">
          <AvatarImage src="https://github.jndkjcom/shadcn.png" alt="@shadcn" />
          <AvatarFallback className="text-white bg-[#3F1A69] font-bold text-2xl">
            {username.slice(0, 1).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-bold text-xl">Hello {username}</p>
        </div>
      </div>

      <Link href={`${id}/notifications`} className="relative">
        <Bell />
        <p className="bg-[#FDFDFD] text-[#121212] flex items-center w-4 h-4 font-bold text-[10px] rounded-full justify-center absolute -top-2 -right-0.5">
          {notfication}
        </p>
      </Link>
    </div>
  );
};

export default Greeting;
