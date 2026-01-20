"use client";

import { WizardLayout, StepNavigation } from "@/components/wizard";
import { Textarea, Card } from "@/components/ui";
import { useWizardStore, useStep3Valid } from "@/store/useWizardStore";
import { Lightbulb, Target } from "lucide-react";

export default function Step3Page() {
  const { skills, focusOfInterest, setSkills, setFocusOfInterest, markStepCompleted } =
    useWizardStore();

  const canContinue = useStep3Valid();

  const handleNext = () => {
    markStepCompleted(3);
  };

  return (
    <WizardLayout
      title="Step 3: Your Profile"
      description="Tell us about your skills and what you want to build"
    >
      <div className="space-y-8">
        {/* Skills */}
        <Card variant="bordered">
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Lightbulb className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Your Strengths and Skills
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Describe your key competencies: technical skills, experience in
                specific areas, soft skills
              </p>
            </div>
          </div>
          <Textarea
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="For example: 5 years of backend development experience (Python, Node.js), FinTech industry understanding, startup experience, strong communication and product management skills..."
            rows={6}
            maxLength={2000}
            charCount
          />
          <p className="text-sm text-gray-500 mt-2">
            Minimum 50 characters. The more detailed your skills, the more accurate
            the recommendations.
          </p>
        </Card>

        {/* Focus of Interest */}
        <Card variant="bordered">
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Target className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                What do you want to build?
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Describe your vision: what problems you want to solve, what type of
                product interests you, any specific ideas
              </p>
            </div>
          </div>
          <Textarea
            value={focusOfInterest}
            onChange={(e) => setFocusOfInterest(e.target.value)}
            placeholder="For example: I want to create a B2B SaaS product that automates routine processes for small businesses. Interested in subscription models with low user onboarding barriers..."
            rows={6}
            maxLength={2000}
            charCount
          />
          <p className="text-sm text-gray-500 mt-2">
            Minimum 50 characters. Tell us about your focus and preferences.
          </p>
        </Card>

        {/* Tips */}
        <Card variant="default" className="bg-gray-50 border border-gray-200">
          <h3 className="font-medium text-gray-900 mb-2">💡 Tips</h3>
          <ul className="text-sm text-gray-600 space-y-1.5">
            <li>• Be specific: instead of &quot;can code&quot; list specific technologies</li>
            <li>• Mention industries where you have domain expertise</li>
            <li>• Describe what business scale interests you (B2B/B2C, local/global)</li>
            <li>• Indicate what matters to you: rapid growth, profitability, social impact</li>
          </ul>
        </Card>

        {/* Validation message */}
        {!canContinue && (
          <p className="text-sm text-orange-600">
            Fill in both fields (minimum 50 characters each) to continue
          </p>
        )}

        <StepNavigation
          currentStep={3}
          canContinue={canContinue}
          onNext={handleNext}
        />
      </div>
    </WizardLayout>
  );
}
