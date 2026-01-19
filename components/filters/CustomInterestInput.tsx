"use client";

import { useState, KeyboardEvent } from "react";
import { Input, Badge, Button } from "@/components/ui";
import { X, Plus } from "lucide-react";

interface CustomInterestInputProps {
  interests: string[];
  onAdd: (interest: string) => void;
  onRemove: (interest: string) => void;
}

export function CustomInterestInput({
  interests,
  onAdd,
  onRemove,
}: CustomInterestInputProps) {
  const [inputValue, setInputValue] = useState("");

  const handleAdd = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !interests.includes(trimmed)) {
      onAdd(trimmed);
      setInputValue("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Например: IoT, Умные устройства..."
          className="flex-1"
        />
        <Button
          type="button"
          variant="secondary"
          onClick={handleAdd}
          disabled={!inputValue.trim()}
        >
          <Plus className="w-4 h-4 mr-1" />
          Добавить
        </Button>
      </div>

      {interests.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {interests.map((interest) => (
            <Badge
              key={interest}
              variant="outline"
              size="md"
              className="flex items-center gap-1 pr-1"
            >
              {interest}
              <button
                type="button"
                onClick={() => onRemove(interest)}
                className="p-0.5 rounded-full hover:bg-gray-200 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
