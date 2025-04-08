"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { type ComponentProps } from "react";
import { motion } from "motion/react";

type Props = ComponentProps<typeof Button> & {
  pending?: boolean;
};

export function FuncButton({ children, className, pending, ...props }: Props) {
  return (
    // @ts-expect-error error
    <motion.button
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.95 }}
      type="submit"
      aria-disabled={pending}
      className={cn(
        `${pending ? "cursor-not-allowed brightness-75" : "cursor-pointer"}`,
        className
      )}
      {...props}
    >
      {pending ? <Loader2 className="animate-spin " /> : children}
    </motion.button>
  );
}
