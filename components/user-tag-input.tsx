"use client";

import { useState, useRef, useEffect } from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export type User = {
  id: string;
  auth_id: string;
  username: string;
  email: string;
  house_id: string;
  amount_owe: number;
  created_at: string;
};

interface UserTagInputProps {
  users: User[];
  onChange?: (selectedUsers: User[]) => void;
  initialSelected?: User[];
  placeholder?: string;
  maxSelections?: number;
}

export function UserTagInput({
  users,
  onChange,
  initialSelected = [],
  placeholder = "Select users...",
  maxSelections = 10,
}: UserTagInputProps) {
  const [open, setOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<User[]>(initialSelected);
  const [searchQuery, setSearchQuery] = useState("");
  const commandRef = useRef<HTMLDivElement>(null);

  const handleSelect = (user: User) => {
    // Check if user is already selected
    if (selectedUsers.some((selected) => selected.auth_id === user.auth_id)) {
      // Remove user if already selected
      const newSelectedUsers = selectedUsers.filter(
        (selected) => selected.auth_id !== user.auth_id
      );
      setSelectedUsers(newSelectedUsers);
      onChange?.(newSelectedUsers);
    } else {
      // Don't add if we've reached the maximum
      if (selectedUsers.length >= maxSelections) return;

      // Add user if not already selected
      const newSelectedUsers = [...selectedUsers, user];
      setSelectedUsers(newSelectedUsers);
      onChange?.(newSelectedUsers);
    }
  };

  const removeUser = (userId: string) => {
    const newSelectedUsers = selectedUsers.filter(
      (user) => user.auth_id !== userId
    );
    setSelectedUsers(newSelectedUsers);
    onChange?.(newSelectedUsers);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        commandRef.current &&
        !commandRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full space-y-2">
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedUsers.map((user) => (
          <Badge
            key={user.auth_id}
            variant="secondary"
            className="px-3 py-1.5 flex items-center gap-2"
          >
            {/* <Avatar className="h-5 w-5">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar> */}
            <span className="font-bold text-sm">{user.username}</span>
            <button
              type="button"
              onClick={() => removeUser(user.auth_id)}
              className="ml-1 rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Remove {user.username}</span>
            </button>
          </Badge>
        ))}
      </div>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="p-3  py-6 text-base border-2 border-[#FDFDFD] w-full flex justify-between focus:border-[#FDFDFD] focus:outline-0 focus:ring-0  placeholder:text-[#161B26] rounded-sm font-bold"
          >
            {selectedUsers.length > 0
              ? `${selectedUsers.length} Housemate${
                  selectedUsers.length > 1 ? "s" : ""
                } selected`
              : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-full p-0 bg-[#121212] text-[#FDFDFD]"
          ref={commandRef}
        >
          <Command>
            <CommandInput
              placeholder="Search users..."
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            <CommandList>
              <CommandEmpty>No users found.</CommandEmpty>
              <CommandGroup className="max-h-64 overflow-auto">
                {users.map((user) => (
                  <CommandItem
                    key={user.auth_id}
                    value={user.auth_id}
                    onSelect={() => handleSelect(user)}
                    className="flex items-center gap-2"
                  >
                    {/* <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar> */}
                    <span className="font-semibold text-base">
                      {user.username}
                    </span>
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        selectedUsers.some(
                          (selected) => selected.auth_id === user.auth_id
                        )
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* <p className="text-xs text-muted-foreground">
        {maxSelections - selectedUsers.length} selections remaining.
      </p> */}
    </div>
  );
}
