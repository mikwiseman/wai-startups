"use client";

import { cn } from "@/lib/utils/cn";
import { Industry } from "@/lib/constants/industries";

interface FilterCardProps {
  industry: Industry;
  isSelected: boolean;
  onToggle: () => void;
}

export function FilterCard({ industry, isSelected, onToggle }: FilterCardProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "relative flex flex-col items-start p-4 rounded-xl border-2 transition-all duration-200 text-left",
        "hover:border-gray-400 hover:shadow-sm",
        "focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2",
        isSelected
          ? "border-gray-900 bg-gray-50"
          : "border-gray-200 bg-white"
      )}
    >
      {/* Selection indicator */}
      <div
        className={cn(
          "absolute top-3 right-3 w-5 h-5 rounded-full border-2 transition-all duration-200",
          isSelected
            ? "border-gray-900 bg-gray-900"
            : "border-gray-300"
        )}
      >
        {isSelected && (
          <svg
            className="w-full h-full text-white p-0.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </div>

      {/* Icon */}
      <span className="text-2xl mb-2">{industry.icon}</span>

      {/* Name */}
      <span
        className={cn(
          "font-medium",
          isSelected ? "text-gray-900" : "text-gray-700"
        )}
      >
        {industry.name}
      </span>

      {/* Description */}
      <span className="text-sm text-gray-500 mt-1 line-clamp-2">
        {industry.description}
      </span>
    </button>
  );
}
