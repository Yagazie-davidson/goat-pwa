"use client";

import { signInAction } from "@/app/actions";
import { SubmitButton } from "@/components/SubmitButton";
import Input from "@/components/Input";
import Link from "next/link";

const page = () => {
  return (
    <form className=" flex h-screen flex-col items-center relative p-4 md:p-24 justify-center  bg-[#FEF5E5] text-[#161B26]">
      <div className="max-w-md w-full">
        <h2 className="text-left text-2xl font-black mb-5">WELCOME BACK</h2>
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col space-y-2">
            <label htmlFor="email" className="font-semibold text-lg">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter Email"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label htmlFor="email" className="font-semibold text-lg">
              Password
            </label>

            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter Password"
            />
          </div>
        </div>
        <Link href={"/auth/signup"} className="underline font-semibold">
          Sign Up
        </Link>
        <div className="absolute bottom-10">
          <div className=" flex justify-center w-full">
            <SubmitButton
              pendingText="Signing In..."
              formAction={signInAction}
              className="bg-[#3F1A69] text-white w-full flex justify-center px-10 rounded-sm font-bold py-3 text-lg"
            >
              Sign in
            </SubmitButton>
          </div>
        </div>
      </div>
    </form>
  );
};

export default page;
