"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface StepNavigationProps {
  currentStep: number;
  canContinue: boolean;
  isLoading?: boolean;
  onNext?: () => void | Promise<void>;
  nextLabel?: string;
  showBack?: boolean;
}

export function StepNavigation({
  currentStep,
  canContinue,
  isLoading = false,
  onNext,
  nextLabel,
  showBack = true,
}: StepNavigationProps) {
  const router = useRouter();

  const handleBack = () => {
    if (currentStep > 1) {
      router.push(`/step-${currentStep - 1}`);
    }
  };

  const handleNext = async () => {
    if (onNext) {
      await onNext();
    }
    if (currentStep < 5) {
      router.push(`/step-${currentStep + 1}`);
    }
  };

  const getNextLabel = () => {
    if (nextLabel) return nextLabel;
    if (currentStep === 5) return "Finish";
    return "Continue";
  };

  return (
    <div className="flex items-center justify-between pt-6 border-t border-gray-200">
      {showBack && currentStep > 1 ? (
        <Button variant="ghost" onClick={handleBack} disabled={isLoading}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      ) : (
        <div />
      )}

      {currentStep < 5 ? (
        <Button
          onClick={handleNext}
          disabled={!canContinue || isLoading}
          isLoading={isLoading}
        >
          {getNextLabel()}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      ) : (
        <div />
      )}
    </div>
  );
}
