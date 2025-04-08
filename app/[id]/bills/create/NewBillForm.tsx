"use client";
import { SubmitButton } from "@/components/SubmitButton";
import React, { useEffect, useRef, useState } from "react";
import Input from "@/components/Input";
import { createNewBill } from "@/app/actions";
import { User, UserTagInput } from "@/components/user-tag-input";
import { useFormState } from "react-dom";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const NewBillForm = ({
  housemates,
  issuer_id,
}: {
  housemates: User[];
  issuer_id: string;
}) => {
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const initialState = { success: false, message: "" };
  const [formState, formAction] = useFormState(createNewBill, initialState);

  useEffect(() => {
    if (formState?.message) {
      if (formState.success) {
        toast.success(formState.message);
        formRef.current?.reset();
        setSelectedUsers([housemates[0]]);
        router.push(`/${issuer_id}`);
      } else {
        toast.error(formState.message);
      }
    }
  }, [formState]);

  return (
    <form action={formAction} className="flex flex-col space-y-6">
      <input
        id="issuer_id"
        name="issuer_id"
        defaultValue={issuer_id}
        type="text"
        className="hidden"
      />
      <input
        id="tagged"
        name="tagged"
        value={JSON.stringify(selectedUsers)}
        type="text"
        readOnly
        className="hidden"
      />
      <div className="flex flex-col space-y-2">
        <label htmlFor="bill_name" className="font-semibold text-lg">
          Bill Name
        </label>
        <Input
          id="bill_name"
          name="bill_name"
          required
          type="text"
          placeholder="Eg 'Water', 'Light'"
        />
      </div>
      <div className="flex flex-col space-y-2">
        <label htmlFor="total_amount" className="font-semibold text-lg">
          Total Amount
        </label>
        <Input
          id="total_amount"
          name="total_amount"
          type="number"
          placeholder="Enter total amount"
        />
      </div>
      <label htmlFor="email" className="font-semibold text-lg">
        Tag Housemates
      </label>
      <UserTagInput
        users={housemates}
        onChange={setSelectedUsers}
        initialSelected={[]}
        placeholder="Tag housemates"
      />
      <div className="flex justify-center w-full">
        <SubmitButton className="bg-[#3F1A69] text-white w-full flex justify-center px-10 rounded-sm font-bold py-3 text-lg">
          Issue Bill
        </SubmitButton>
      </div>
    </form>
  );
};
