"use client";
import Input from "@/components/Input";
import React from "react";

type Props = {
  bank_name: string;
  account_number: number;
  account_name: string;
};

const DisplayAccountInfo = ({
  bank_name,
  account_name,
  account_number,
}: Props) => {
  return (
    <div className="flex flex-col space-y-10 h-full w-full">
      <div className="mb-10">
        <label className="font-semibold">Bank Name:</label>
        {/* <p>{bank_name}</p> */}
        <Input
          value={bank_name}
          readOnly
          className="w-full text-white"
          placeholder={bank_name}
        />
      </div>
      <div>
        <label>Account Number</label>
        {/* <p>{account_number}</p> */}
        <Input
          value={account_number}
          placeholder={account_number?.toString()}
          readOnly
          className="w-full text-white"
        />
      </div>
      <div>
        <label>Account Name</label>
        {/* <p>{account_name}</p> */}
        <Input
          value={account_name}
          placeholder={account_name}
          readOnly
          className="w-full text-white"
        />
      </div>
    </div>
  );
};

export default DisplayAccountInfo;
