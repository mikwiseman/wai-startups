"use client";

import { ReactNode } from "react";
import { StepIndicator } from "./StepIndicator";
import { useWizardStore } from "@/store/useWizardStore";
import { Sparkles } from "lucide-react";

interface WizardLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
}

export function WizardLayout({ children, title, description }: WizardLayoutProps) {
  const { currentStep, completedSteps } = useWizardStore();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-6 h-6 text-gray-900" />
            <span className="font-semibold text-gray-900">
              Генератор стартап-идей
            </span>
          </div>
          <StepIndicator
            currentStep={currentStep}
            completedSteps={completedSteps}
          />
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {description && (
            <p className="mt-2 text-gray-600">{description}</p>
          )}
        </div>
        {children}
      </main>
    </div>
  );
}
