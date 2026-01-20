"use client";

import { WizardLayout, StepNavigation } from "@/components/wizard";
import { IndustryFilterGrid } from "@/components/filters";
import { Card } from "@/components/ui";
import { useWizardStore, useStep1Valid } from "@/store/useWizardStore";

export default function Step1Page() {
  const {
    selectedIndustries,
    toggleIndustry,
    markStepCompleted,
  } = useWizardStore();

  const canContinue = useStep1Valid();

  const handleNext = () => {
    markStepCompleted(1);
  };

  return (
    <WizardLayout
      title="Step 1: Your Interests"
      description="Select industries that interest you"
    >
      <div className="space-y-8">
        {/* Industry selection */}
        <Card variant="bordered">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Select Industries
          </h2>
          <p className="text-gray-600 mb-4">
            Check one or more industries you&apos;re interested in
          </p>
          <IndustryFilterGrid
            selectedIndustries={selectedIndustries}
            onToggle={toggleIndustry}
          />
          {selectedIndustries.length > 0 && (
            <p className="mt-4 text-sm text-gray-500">
              Selected: {selectedIndustries.length}
            </p>
          )}
        </Card>

        {/* Validation message */}
        {!canContinue && (
          <p className="text-sm text-orange-600">
            Select at least one industry to continue
          </p>
        )}

        <StepNavigation
          currentStep={1}
          canContinue={canContinue}
          onNext={handleNext}
          showBack={false}
        />
      </div>
    </WizardLayout>
  );
}
