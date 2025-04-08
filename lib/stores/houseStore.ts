// stores/houseStore.ts
import { create } from "zustand";

interface HouseStore {
  houseId: string;
  setHouseId: (id: string) => void;
  clearHouseId: () => void;
}

export const useHouseStore = create<HouseStore>((set) => ({
  houseId: "",
  setHouseId: (id) => set({ houseId: id }),
  clearHouseId: () => set({ houseId: "" }),
}));
