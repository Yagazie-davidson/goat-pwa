"use client";
import { usePathname } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
// import { Icons } from "@/components/icons";
import { Grip, HomeIcon, NotebookIcon, ReceiptText } from "lucide-react";
export default function Navbar({ userId }: { userId: string }) {
  const pathname = usePathname();
  return (
    <>
      {/* <div className="w-full pointer-events-none fixed inset-x-0 bottom-0 z-30 mx-auto mb-4 flex origin-bottom h-full max-h-14">
        <div className="fixed bottom-0 inset-x-0 h-16 w-full bg-background to-transparent backdrop-blur-lg [-webkit-mask-image:linear-gradient(to_top,black,transparent)] dark:bg-background"></div>
        <Dock className="z-50 w-full pointer-events-auto relative mx-auto flex min-h-full h-full items-center justify-center px-1 bg-background  ">
          <DockIcon>
            <Link
              href={`/${userId}`}
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "size-12"
              )}
            >
              <HomeIcon className="size-4" />
            </Link>
          </DockIcon>
          <DockIcon>
            <Link
              href={`/${userId}`}
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "size-12"
              )}
            >
              <HomeIcon className="size-4" />
            </Link>
          </DockIcon>
          <DockIcon>
            <Link
              href={`/${userId}`}
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "size-12"
              )}
            >
              <HomeIcon className="size-4" />
            </Link>
          </DockIcon>
        </Dock>
      </div> */}
      <div className="fixed w-full bottom-5 z-30 origin-bottom h-full max-h-14 flex justify-center   bg-[#121212] text-[#FDFDFD]">
        <div className="flex items-center justify-center space-x-10 w-full max-w-52">
          <Link
            href={`/${userId}`}
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              "size-12 flex flex-col"
            )}
          >
            <div className="relative">
              <HomeIcon
                className="size-6"
                color={pathname == `/${userId}` ? "#FDFDFD" : "#848484"}
              />
              {pathname === `/${userId}` && (
                <div className="absolute top-0 right-0">
                  <div className="h-2 w-2 flex items-center rounded-full bg-[#FDFDFD]"></div>
                </div>
              )}
            </div>
            <p className="text-[12px] font-bold">Home</p>
          </Link>
          <Link
            href={`/${userId}/bills`}
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              "size-12 flex flex-col"
            )}
          >
            <div className="relative">
              <ReceiptText
                className="size-6"
                color={
                  pathname.includes(`/${userId}/bills`) ? "#FDFDFD" : "#848484"
                }
              />

              {pathname.includes(`/${userId}/bills`) && (
                <div className="absolute top-0 right-0">
                  <div className="h-2 w-2 flex items-center rounded-full bg-[#FDFDFD]"></div>
                </div>
              )}
            </div>
            <p className="text-[12px] font-bold">Bills</p>
          </Link>{" "}
          <Link
            href={`/${userId}/more`}
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              "size-12 flex flex-col"
            )}
          >
            <div className="relative">
              <Grip
                className="size-6"
                color={
                  pathname.includes(`/${userId}/more`) ? "#FDFDFD" : "#848484"
                }
              />

              {pathname.includes(`/${userId}/more`) && (
                <div className="absolute top-0 right-0">
                  <div className="h-2 w-2 flex items-center rounded-full bg-[#FDFDFD]"></div>
                </div>
              )}
            </div>
            <p className="text-[12px] font-bold text-[#FDFDFD]">More</p>
          </Link>
        </div>
      </div>
    </>
  );
}
