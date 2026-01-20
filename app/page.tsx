"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useWizardStore } from "@/store/useWizardStore";
import { Sparkles, ArrowRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui";

export default function Home() {
  const router = useRouter();
  const { completedSteps, selectedIndustries, resetWizard } = useWizardStore();
  const [hasExistingSession, setHasExistingSession] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    // Check if there's any existing session data
    const hasData = completedSteps.length > 0 || selectedIndustries.length > 0;
    setHasExistingSession(hasData);
  }, [completedSteps, selectedIndustries]);

  const handleContinue = () => {
    // Navigate to the furthest completed step + 1, or step 1
    const nextStep = completedSteps.length > 0
      ? Math.min(Math.max(...completedSteps) + 1, 5)
      : 1;
    router.push(`/step-${nextStep}`);
  };

  const handleNewSession = () => {
    resetWizard();
    router.push("/step-1");
  };

  // Show loading state while hydrating to avoid flash
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse">
          <Sparkles className="w-12 h-12 text-gray-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-900 rounded-2xl mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Startup Idea Generator
          </h1>
          <p className="text-gray-600">
            Find the perfect idea for your startup based on your interests and skills
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          {hasExistingSession ? (
            <>
              <div className="text-center text-sm text-gray-500 mb-4">
                You have an incomplete session
              </div>
              <Button onClick={handleContinue} className="w-full" size="lg">
                <ArrowRight className="w-5 h-5 mr-2" />
                Continue
              </Button>
              <Button
                onClick={handleNewSession}
                variant="outline"
                className="w-full"
                size="lg"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Start Over
              </Button>
            </>
          ) : (
            <Button onClick={handleNewSession} className="w-full" size="lg">
              <Sparkles className="w-5 h-5 mr-2" />
              Start
            </Button>
          )}
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Powered by AI
        </p>
      </div>
    </div>
  );
}
