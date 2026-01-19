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
      title="Шаг 3: Ваш профиль"
      description="Расскажите о своих навыках и что вы хотите создать"
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
                Ваши сильные стороны и навыки
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Опишите ваши ключевые компетенции: технические навыки, опыт в
                определённых областях, soft skills
              </p>
            </div>
          </div>
          <Textarea
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="Например: 5 лет опыта в backend-разработке (Python, Node.js), понимание финтех-индустрии, опыт работы в стартапах, сильные навыки коммуникации и управления продуктом..."
            rows={6}
            maxLength={2000}
            charCount
          />
          <p className="text-sm text-gray-500 mt-2">
            Минимум 50 символов. Чем подробнее вы опишете навыки, тем точнее
            будут рекомендации.
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
                Что вы хотите создать?
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Опишите ваше видение: какие проблемы хотите решать, какой тип
                продукта интересен, есть ли конкретные идеи
              </p>
            </div>
          </div>
          <Textarea
            value={focusOfInterest}
            onChange={(e) => setFocusOfInterest(e.target.value)}
            placeholder="Например: Хочу создать B2B SaaS-продукт, который автоматизирует рутинные процессы для малого бизнеса. Интересует сегмент с возможностью подписочной модели и низким порогом входа для пользователей..."
            rows={6}
            maxLength={2000}
            charCount
          />
          <p className="text-sm text-gray-500 mt-2">
            Минимум 50 символов. Расскажите о своём фокусе и предпочтениях.
          </p>
        </Card>

        {/* Tips */}
        <Card variant="default" className="bg-gray-50 border border-gray-200">
          <h3 className="font-medium text-gray-900 mb-2">💡 Советы</h3>
          <ul className="text-sm text-gray-600 space-y-1.5">
            <li>• Будьте конкретны: вместо &quot;умею программировать&quot; укажите конкретные технологии</li>
            <li>• Упомяните отрасли, в которых у вас есть domain expertise</li>
            <li>• Опишите, какой масштаб бизнеса вам интересен (B2B/B2C, локальный/глобальный)</li>
            <li>• Укажите, что для вас важно: быстрый рост, прибыльность, social impact</li>
          </ul>
        </Card>

        {/* Validation message */}
        {!canContinue && (
          <p className="text-sm text-orange-600">
            Заполните оба поля (минимум 50 символов каждое), чтобы продолжить
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
