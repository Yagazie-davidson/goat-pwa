import { Power } from "lucide-react";
import React from "react";

const SignoutButton = () => {
  return (
    <button className="flex bg-red-500 items-center justify-between py-3 px-1 rounded-sm cursor-pointer">
      <div>
        <p>Signout</p>
      </div>
      <Power size={20} />
    </button>
  );
};

export default SignoutButton;
