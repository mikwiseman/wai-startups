"use client";

import { cn } from "@/lib/utils/cn";
import { HTMLAttributes } from "react";

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
}

export function Skeleton({
  className,
  variant = "rectangular",
  width,
  height,
  style,
  ...props
}: SkeletonProps) {
  const variants = {
    text: "rounded",
    circular: "rounded-full",
    rectangular: "rounded-lg",
  };

  return (
    <div
      className={cn(
        "bg-gray-200 animate-pulse",
        variants[variant],
        className
      )}
      style={{
        width: width,
        height: height,
        ...style,
      }}
      {...props}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
      <div className="flex justify-between items-start">
        <Skeleton width={100} height={24} />
        <Skeleton variant="circular" width={32} height={32} />
      </div>
      <Skeleton width="70%" height={20} />
      <div className="space-y-2">
        <Skeleton height={14} />
        <Skeleton height={14} />
        <Skeleton width="80%" height={14} />
      </div>
      <div className="flex gap-2 pt-2">
        <Skeleton width={60} height={24} variant="text" />
        <Skeleton width={60} height={24} variant="text" />
        <Skeleton width={60} height={24} variant="text" />
      </div>
    </div>
  );
}

export function SkeletonIdeaCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
      <Skeleton width="60%" height={24} />
      <div className="space-y-3">
        <div>
          <Skeleton width={80} height={14} className="mb-2" />
          <Skeleton height={16} />
        </div>
        <div>
          <Skeleton width={80} height={14} className="mb-2" />
          <Skeleton height={16} />
        </div>
        <div>
          <Skeleton width={100} height={14} className="mb-2" />
          <Skeleton height={16} />
        </div>
      </div>
    </div>
  );
}
