"use client";

import { useState, type KeyboardEvent } from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Input from "@/components/Input";

interface TagInputProps {
  placeholder?: string;
  onChange?: (tags: string[]) => void;
  initialTags?: string[];
  maxTags?: number;
}

export function TagInput({
  placeholder = "Add tags...",
  onChange,
  initialTags = [],
  maxTags = 10,
}: TagInputProps) {
  const [tags, setTags] = useState<string[]>(initialTags);
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();

      // Don't add if we've reached the maximum number of tags
      if (tags.length >= maxTags) return;

      // Don't add if the tag already exists
      if (tags.includes(inputValue.trim())) return;

      const newTags = [...tags, inputValue.trim()];
      setTags(newTags);
      setInputValue("");

      // Call onChange callback if provided
      if (onChange) {
        onChange(newTags);
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = tags.filter((tag) => tag !== tagToRemove);
    setTags(newTags);

    // Call onChange callback if provided
    if (onChange) {
      onChange(newTags);
    }
  };

  return (
    <div className="w-full space-y-2">
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <Badge key={index} variant="secondary" className="px-3 py-1.5">
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="ml-2 rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Remove {tag} tag</span>
            </button>
          </Badge>
        ))}
      </div>
      <Input
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full"
      />
      <p className="text-xs text-muted-foreground">
        Press Enter to add a tag. {maxTags - tags.length} tags remaining.
      </p>
    </div>
  );
}
