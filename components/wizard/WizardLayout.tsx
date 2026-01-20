"use client";

import { ReactNode } from "react";
import { StepIndicator } from "./StepIndicator";
import { useWizardStore } from "@/store/useWizardStore";
import { Sparkles, RotateCcw } from "lucide-react";

interface WizardLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
}

export function WizardLayout({ children, title, description }: WizardLayoutProps) {
  const { currentStep, completedSteps, resetWizard } = useWizardStore();

  const handleNewSession = () => {
    if (confirm("Start a new session? All current data will be deleted.")) {
      resetWizard();
      window.location.href = "/step-1";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-gray-900" />
              <span className="font-semibold text-gray-900">
                Startup Idea Generator
              </span>
            </div>
            <button
              onClick={handleNewSession}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>New Session</span>
            </button>
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
