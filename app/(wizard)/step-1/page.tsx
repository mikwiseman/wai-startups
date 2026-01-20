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
      title="Шаг 1: Ваши интересы"
      description="Выберите индустрии, которые вас интересуют"
    >
      <div className="space-y-8">
        {/* Industry selection */}
        <Card variant="bordered">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Выберите индустрии
          </h2>
          <p className="text-gray-600 mb-4">
            Отметьте одну или несколько индустрий, которые вам интересны
          </p>
          <IndustryFilterGrid
            selectedIndustries={selectedIndustries}
            onToggle={toggleIndustry}
          />
          {selectedIndustries.length > 0 && (
            <p className="mt-4 text-sm text-gray-500">
              Выбрано: {selectedIndustries.length}
            </p>
          )}
        </Card>

        {/* Validation message */}
        {!canContinue && (
          <p className="text-sm text-orange-600">
            Выберите хотя бы одну индустрию, чтобы продолжить
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
