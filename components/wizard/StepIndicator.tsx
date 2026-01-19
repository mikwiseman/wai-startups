"use client";

import { cn } from "@/lib/utils/cn";
import { Check } from "lucide-react";

interface Step {
  number: number;
  title: string;
  description: string;
}

const STEPS: Step[] = [
  { number: 1, title: "Интересы", description: "Выберите индустрии" },
  { number: 2, title: "Исследование", description: "Оцените проекты" },
  { number: 3, title: "Профиль", description: "Расскажите о себе" },
  { number: 4, title: "Идеи", description: "Генерация идей" },
  { number: 5, title: "Результат", description: "Финальные рекомендации" },
];

interface StepIndicatorProps {
  currentStep: number;
  completedSteps: number[];
}

export function StepIndicator({
  currentStep,
  completedSteps,
}: StepIndicatorProps) {
  return (
    <nav aria-label="Progress" className="w-full">
      <ol className="flex items-center justify-between">
        {STEPS.map((step, index) => {
          const isCompleted = completedSteps.includes(step.number);
          const isCurrent = currentStep === step.number;
          const isLast = index === STEPS.length - 1;

          return (
            <li
              key={step.number}
              className={cn(
                "relative flex flex-col items-center",
                !isLast && "flex-1"
              )}
            >
              {/* Connector line */}
              {!isLast && (
                <div
                  className={cn(
                    "absolute top-4 left-[calc(50%+20px)] w-[calc(100%-40px)] h-0.5",
                    isCompleted ? "bg-gray-900" : "bg-gray-200"
                  )}
                />
              )}

              {/* Step circle */}
              <div
                className={cn(
                  "relative z-10 flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-all duration-200",
                  isCompleted
                    ? "bg-gray-900 text-white"
                    : isCurrent
                    ? "bg-gray-900 text-white ring-4 ring-gray-900/20"
                    : "bg-gray-100 text-gray-500"
                )}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4" />
                ) : (
                  step.number
                )}
              </div>

              {/* Step title */}
              <div className="mt-2 text-center">
                <p
                  className={cn(
                    "text-sm font-medium",
                    isCurrent || isCompleted
                      ? "text-gray-900"
                      : "text-gray-500"
                  )}
                >
                  {step.title}
                </p>
                <p className="text-xs text-gray-400 hidden sm:block">
                  {step.description}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
