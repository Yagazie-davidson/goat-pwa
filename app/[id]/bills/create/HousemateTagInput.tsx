"use client";

import { useState, useRef, useEffect } from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import Image from "next/image";

export type Housemate = {
  id: string;
  auth_id: string;
  username: string;
  email: string;
  house_id: string;
  amount_owe: number;
  created_at: string;
};

interface HousemateTagInputProps {
  housemates: Housemate[];
  name: string;
  onChange?: (selectedHousemates: Housemate[]) => void;
  initialSelected?: Housemate[];
}

export function HousemateTagInput({
  housemates = [],
  name,
  onChange,
  initialSelected = [],
}: HousemateTagInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedHousemates, setSelectedHousemates] =
    useState<Housemate[]>(initialSelected);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter housemates based on search query
  const filteredHousemates = housemates.filter((housemate) =>
    housemate.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (housemate: Housemate) => {
    // Check if housemate is already selected
    if (selectedHousemates.some((selected) => selected.id === housemate.id)) {
      // Remove housemate if already selected
      const newSelectedHousemates = selectedHousemates.filter(
        (selected) => selected.id !== housemate.id
      );
      setSelectedHousemates(newSelectedHousemates);
      onChange?.(newSelectedHousemates);
    } else {
      // Add housemate if not already selected
      const newSelectedHousemates = [...selectedHousemates, housemate];
      setSelectedHousemates(newSelectedHousemates);
      onChange?.(newSelectedHousemates);
    }
  };

  const removeHousemate = (housemateId: string) => {
    const newSelectedHousemates = selectedHousemates.filter(
      (housemate) => housemate.id !== housemateId
    );
    setSelectedHousemates(newSelectedHousemates);
    onChange?.(newSelectedHousemates);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full">
      {/* Hidden input to store selected housemate IDs for form submission */}
      <input
        type="hidden"
        name={name}
        value={selectedHousemates.map((h) => h.id).join(",")}
      />

      {/* Selected housemates display */}
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedHousemates.map((housemate) => (
          <div
            key={housemate.id}
            className="bg-gray-100 px-3 py-1.5 rounded-md flex items-center gap-2"
          >
            <div className="h-5 w-5 rounded-full bg-[#3F1A69] flex items-center justify-center text-white text-xs">
              {housemate.username.charAt(0)}
            </div>
            <span>{housemate.username}</span>
            <button
              type="button"
              onClick={() => removeHousemate(housemate.id)}
              className="ml-1 text-gray-500 hover:text-gray-700"
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Remove {housemate.username}</span>
            </button>
          </div>
        ))}
      </div>

      {/* Dropdown trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between border border-gray-300 rounded-sm px-3 py-2 bg-white"
      >
        <span className="text-gray-500">
          {selectedHousemates.length > 0
            ? `${selectedHousemates.length} housemate${
                selectedHousemates.length > 1 ? "s" : ""
              } selected`
            : "Select housemates"}
        </span>
        <ChevronsUpDown className="h-4 w-4 text-gray-500" />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-sm shadow-lg"
        >
          {/* Search input */}
          <div className="p-2 border-b border-gray-200">
            <input
              type="text"
              placeholder="Search housemates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded-sm"
            />
          </div>

          {/* Housemate list */}
          <div className="max-h-60 overflow-auto">
            {filteredHousemates.length === 0 ? (
              <div className="p-2 text-center text-gray-500">
                No housemates found
              </div>
            ) : (
              filteredHousemates.map((housemate) => (
                <div
                  key={housemate.id}
                  onClick={() => handleSelect(housemate)}
                  className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer"
                >
                  <div className="h-8 w-8 rounded-full bg-[#3F1A69] flex items-center justify-center text-white">
                    {housemate.username.charAt(0)}
                  </div>
                  <span>{housemate.username}</span>
                  {selectedHousemates.some(
                    (selected) => selected.id === housemate.id
                  ) && <Check className="ml-auto h-4 w-4 text-[#3F1A69]" />}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
