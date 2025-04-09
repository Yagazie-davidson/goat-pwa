"use client";
import { signUpAction } from "@/app/actions";
import Input from "@/components/Input";
import { SubmitButton } from "@/components/SubmitButton";

const page = () => {
  return (
    <div className=" flex h-screen flex-col items-center relative p-4 md:p-24 justify-center ">
      <div className="max-w-md w-full">
        <h2 className="text-left text-2xl font-black mb-5">
          WELCOME, Create account
        </h2>
        <form className="flex flex-col space-y-6">
          <div className="flex flex-col space-y-2">
            <label htmlFor="email" className="font-semibold text-lg">
              House ID
            </label>

            <Input
              id="houseId"
              name="houseId"
              type="text"
              placeholder="House ID"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label htmlFor="email" className="font-semibold text-lg">
              Username
            </label>

            <Input
              id="username"
              name="username"
              type="text"
              placeholder="Enter Something fun and Unique"
            />
          </div>
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
          <div className="absolute bottom-10">
            <div className=" flex justify-center w-full">
              <SubmitButton
                formAction={signUpAction}
                className="bg-[#3F1A69] text-white w-full flex justify-center px-10 rounded-sm font-bold py-3 text-lg"
              >
                Create Account
              </SubmitButton>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default page;
