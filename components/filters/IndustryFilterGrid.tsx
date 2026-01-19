"use client";

import { INDUSTRIES } from "@/lib/constants/industries";
import { FilterCard } from "./FilterCard";

interface IndustryFilterGridProps {
  selectedIndustries: string[];
  onToggle: (industryId: string) => void;
}

export function IndustryFilterGrid({
  selectedIndustries,
  onToggle,
}: IndustryFilterGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {INDUSTRIES.map((industry) => (
        <FilterCard
          key={industry.id}
          industry={industry}
          isSelected={selectedIndustries.includes(industry.id)}
          onToggle={() => onToggle(industry.id)}
        />
      ))}
    </div>
  );
}
