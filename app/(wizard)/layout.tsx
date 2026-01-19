"use client";

import { ReactNode, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useWizardStore } from "@/store/useWizardStore";

interface WizardLayoutProps {
  children: ReactNode;
}

export default function WizardRouteLayout({ children }: WizardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { setCurrentStep, completedSteps } = useWizardStore();

  // Extract step number from pathname
  const stepMatch = pathname.match(/step-(\d+)/);
  const currentStep = stepMatch ? parseInt(stepMatch[1], 10) : 1;

  useEffect(() => {
    setCurrentStep(currentStep);
  }, [currentStep, setCurrentStep]);

  // Redirect to the correct step if trying to access a step that hasn't been unlocked
  useEffect(() => {
    if (currentStep > 1) {
      const previousStep = currentStep - 1;
      if (!completedSteps.includes(previousStep) && previousStep !== 0) {
        // Allow going back, but not forward past completed steps
        const maxAllowedStep = Math.max(...completedSteps, 1) + 1;
        if (currentStep > maxAllowedStep) {
          router.replace(`/step-${maxAllowedStep}`);
        }
      }
    }
  }, [currentStep, completedSteps, router]);

  return <>{children}</>;
}
