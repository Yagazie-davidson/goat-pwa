"use client";
import { useHouseStore } from "@/lib/stores/houseStore";
import React from "react";

type Props = {
  id: string;
};

const SaveHouseId = ({ id }: Props) => {
  const setHouseId = useHouseStore((state) => state.setHouseId);
  setHouseId(id);

  return <div></div>;
};

export default SaveHouseId;
