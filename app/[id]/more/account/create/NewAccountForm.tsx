"use client";
import { SubmitButton } from "@/components/SubmitButton";
import React, { useEffect, useRef } from "react";
import Input from "@/components/Input";
import { updateAccountInfo } from "@/app/actions";
import { useFormState } from "react-dom";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const NewAccountForm = ({ user_id }: { user_id: string }) => {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const initialState = { success: false, message: "" };
  const [formState, formAction] = useFormState(updateAccountInfo, initialState);

  useEffect(() => {
    if (formState?.message) {
      if (formState.success) {
        toast.success(formState.message);
        formRef.current?.reset();
        router.push(`/${user_id}/more/account`);
      } else {
        toast.error(formState.message);
      }
    }
  }, [formState]);

  return (
    <form action={formAction} className="flex flex-col space-y-6">
      <input
        id="user_id"
        name="user_id"
        defaultValue={user_id}
        type="text"
        className="hidden"
      />

      <div className="flex flex-col space-y-2">
        <label htmlFor="bank_name" className="font-semibold text-lg">
          Bank Name
        </label>
        <Input
          id="bank_name"
          name="bank_name"
          required
          type="text"
          placeholder="Enter bank name"
        />
      </div>
      <div className="flex flex-col space-y-2">
        <label htmlFor="account_number" className="font-semibold text-lg">
          Account Number
        </label>
        <Input
          id="account_number"
          name="account_number"
          type="number"
          required
          placeholder="Enter account number"
        />
      </div>
      <div className="flex flex-col space-y-2">
        <label htmlFor="account_name" className="font-semibold text-lg">
          Account Name
        </label>
        <Input
          id="account_name"
          name="account_name"
          required
          type="text"
          placeholder="Enter Name of the account"
        />
      </div>

      <div className="flex justify-center w-full mt-20">
        <SubmitButton className="bg-[#3F1A69] text-white w-full flex justify-center px-10 rounded-sm font-bold py-3 text-lg">
          Update Account Info
        </SubmitButton>
      </div>
    </form>
  );
};
