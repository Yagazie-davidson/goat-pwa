import React, { ComponentProps } from "react";
import { motion } from "motion/react";
import { Input as InputBox } from "./ui/input";
import { cn } from "@/lib/utils";

type Props = ComponentProps<typeof InputBox> & {};
const Input = ({ className, id, name, type, placeholder }: Props) => {
  return (
    <motion.input
      whileFocus={{ scaleX: 1.01 }}
      transition={{ ease: "easeIn", duration: 0.1 }}
      id={id}
      name={name}
      type={type}
      className={cn(
        "p-3 border-2 border-[#FDFDFD] font-semibold focus:border-[#FDFDFD] focus:outline-0 focus:ring-0  placeholder:text-gray-300 rounded-sm",
        className
      )}
      placeholder={placeholder}
    />
  );
};

export default Input;
