"use client";

import { cn } from "@/lib/utils/cn";
import { forwardRef, TextareaHTMLAttributes } from "react";

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  charCount?: boolean;
  maxLength?: number;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      error,
      hint,
      charCount = false,
      maxLength,
      value,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
    const currentLength = typeof value === "string" ? value.length : 0;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          value={value}
          maxLength={maxLength}
          className={cn(
            "w-full px-4 py-3 text-gray-900 bg-white border rounded-lg transition-colors duration-200 resize-none",
            "placeholder:text-gray-400",
            "focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent",
            "disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed",
            error
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 hover:border-gray-400",
            className
          )}
          {...props}
        />
        <div className="flex justify-between mt-1.5">
          <div>
            {hint && !error && (
              <p className="text-sm text-gray-500">{hint}</p>
            )}
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>
          {charCount && maxLength && (
            <p
              className={cn(
                "text-sm",
                currentLength > maxLength * 0.9
                  ? "text-orange-600"
                  : "text-gray-400"
              )}
            >
              {currentLength}/{maxLength}
            </p>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
