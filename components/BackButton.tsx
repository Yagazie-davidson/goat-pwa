"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="px-4 py-2 text-[#FDFDFD] rounded-sm transition flex items-center "
    >
      <ChevronLeft />
      {/* <span className="font-bold">Back</span> */}
    </button>
  );
}
