"use client";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Skeleton } from "@/components/ui/skeleton";
import { FuncButton } from "@/components/FuncButton";
import { updateBillForVerification, verifyBillPaid } from "../actions";
import { toast } from "sonner";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
// import Link from "next/link";
// import { useParams } from "next/navigation";

type Tag = {
  id: string;
  bill_id: string;
  bill_name: string;
  amount: number;
  status: string;
  housemate_id: string;
  created_at: string;
  issuer_id: string;
  issuer_name: string;
};
type TagsArray = {
  tags: Tag[] | null;
};
const RecentBills = ({ tags }: TagsArray) => {
  const pathname = usePathname();
  const [payingButton, setPayingButton] = useState(false);
  const handleIhavePaidButton = async (id: string, housemate_id: string) => {
    setPayingButton(true);
    try {
      const res = await updateBillForVerification(id, housemate_id);
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      toast.success(res.message);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setPayingButton(false);
    }
  };
  const confirmIHavePaid = async (
    id: string,
    housemate_id: string,
    issuer_id: string
  ) => {
    setPayingButton(true);
    try {
      const res = await verifyBillPaid(id, housemate_id, issuer_id);
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      toast.success(res.message);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setPayingButton(false);
    }
  };
  console.log(tags);
  return (
    <div>
      <Table>
        {/* {!params?.includes("/bill") && (
          <TableCaption>
            {tags && (
              <Link
                href={`${tags[0].housemate_id}/bills`}
                className="underline"
              >
                See more
              </Link>
            )}
          </TableCaption>
        )} */}
        <TableHeader className="">
          <TableRow className="">
            <TableHead className="w-[100px] font-bold text-[#FDFDFD]">
              Name
            </TableHead>
            <TableHead className="text-right font-bold text-[#FDFDFD]">
              Amount
            </TableHead>

            <TableHead className="text-right font-bold text-[#FDFDFD]">
              Status
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!tags
            ? [1, 2, 3].map((skel) => (
                <TableRow key={skel}>
                  <TableCell className="font-medium">
                    <Skeleton className="h-4 w-[250px]" />
                  </TableCell>

                  <TableCell className="text-right">
                    <Skeleton className="h-4 w-[250px]" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-4 w-[250px]" />
                  </TableCell>
                </TableRow>
              ))
            : tags.map((tag, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      <Drawer>
                        <DrawerTrigger className="underline">
                          {tag.bill_name}
                        </DrawerTrigger>
                        <DrawerContent className="h-[30rem] bg-[#121212] text-[#FDFDFD]">
                          <DrawerHeader>
                            <DrawerTitle className="text-[#FDFDFD]">
                              <p>
                                <strong>Bill:</strong> {tag.bill_name}
                              </p>
                              <p>
                                <strong>Date:</strong> {tag.created_at}
                              </p>
                              <p>
                                <strong>Isuued by:</strong> {tag.issuer_name}
                              </p>
                            </DrawerTitle>
                            <DrawerDescription>
                              {pathname.includes("/notifications") ? (
                                <FuncButton
                                  onClick={() =>
                                    confirmIHavePaid(
                                      tag.id,
                                      tag.housemate_id,
                                      tag.issuer_id
                                    )
                                  }
                                  pending={payingButton}
                                  className="bg-[#3F1A69] text-white w-full flex justify-center px-10 rounded-sm font-bold py-3 text-lg"
                                >
                                  Confirm payment
                                </FuncButton>
                              ) : (
                                tag.status !== "paid" &&
                                tag.status !== "verifying" && (
                                  <FuncButton
                                    onClick={() =>
                                      handleIhavePaidButton(
                                        tag.id,
                                        tag.housemate_id
                                      )
                                    }
                                    pending={payingButton}
                                    className="bg-[#3F1A69] text-white w-full flex justify-center px-10 rounded-sm font-bold py-3 text-lg"
                                  >
                                    I have paid
                                  </FuncButton>
                                )
                              )}
                            </DrawerDescription>
                          </DrawerHeader>
                          <DrawerFooter>
                            <DrawerClose>
                              <button>Cancel</button>
                            </DrawerClose>
                          </DrawerFooter>
                        </DrawerContent>
                      </Drawer>
                    </TableCell>

                    <TableCell className="text-right">{tag.amount}</TableCell>
                    <TableCell className="text-right">
                      <span
                        className={cn(
                          {
                            "text-yellow-500": tag.status === "pending",
                            "text-[#FDFDFD]": tag.status === "verifying",
                            "text-green-500": tag.status === "paid",
                          },
                          "p-1"
                        )}
                      >
                        {tag.status}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
        </TableBody>
      </Table>
    </div>
  );
};

export default RecentBills;
