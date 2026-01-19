"use client";

import { useState, useEffect } from "react";
import { WizardLayout } from "@/components/wizard";
import { DetailedIdeaCard } from "@/components/ideas";
import { ExportButtons } from "@/components/export";
import { Button, SkeletonIdeaCard } from "@/components/ui";
import { useWizardStore } from "@/store/useWizardStore";
import { useStreamingResponse, parseIdeasFromResponse } from "@/hooks/useStreamingResponse";
import { DetailedStartupIdea } from "@/types/wizard";
import { Sparkles, RefreshCw, RotateCcw, CheckCircle } from "lucide-react";

export default function Step5Page() {
  const {
    selectedIndustries,
    customInterests,
    userBackground,
    skills,
    focusOfInterest,
    likedProjects,
    dislikedProjects,
    generatedIdeas,
    likedIdeas,
    dislikedIdeas,
    finalRecommendations,
    setFinalRecommendations,
    resetWizard,
    markStepCompleted,
  } = useWizardStore();

  const { response, isStreaming, error, startStreaming, reset } = useStreamingResponse();

  // Parse ideas from streaming response
  const [parsedIdeas, setParsedIdeas] = useState<DetailedStartupIdea[]>([]);

  useEffect(() => {
    if (response) {
      const ideas = parseIdeasFromResponse(response);
      if (ideas.length > 0) {
        setParsedIdeas(ideas as DetailedStartupIdea[]);
      }
    }
  }, [response]);

  // Update store when streaming completes
  useEffect(() => {
    if (!isStreaming && parsedIdeas.length > 0 && finalRecommendations.length === 0) {
      setFinalRecommendations(parsedIdeas);
      markStepCompleted(5);
    }
  }, [isStreaming, parsedIdeas, finalRecommendations.length, setFinalRecommendations, markStepCompleted]);

  const handleGenerate = () => {
    reset();
    setParsedIdeas([]);
    setFinalRecommendations([]);

    startStreaming("/api/claude/final-recommendations", {
      selectedIndustries,
      customInterests,
      userBackground,
      skills,
      focusOfInterest,
      likedProjects,
      dislikedProjects,
      generatedIdeas,
      likedIdeas,
      dislikedIdeas,
    });
  };

  const handleStartOver = () => {
    if (confirm("Вы уверены, что хотите начать заново? Все данные будут удалены.")) {
      resetWizard();
      window.location.href = "/step-1";
    }
  };

  // Use either stored ideas or parsed ideas
  const displayIdeas = finalRecommendations.length > 0 ? finalRecommendations : parsedIdeas;

  return (
    <WizardLayout
      title="Шаг 5: Финальные рекомендации"
      description="ИИ сгенерирует 10 детальных идей с планом действий"
    >
      <div className="space-y-6">
        {/* Generate button */}
        {displayIdeas.length === 0 && !isStreaming && (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Финальный этап!
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              На основе всего собранного фидбека ИИ создаст 10 детальных идей
              с конкретными шагами для реализации MVP
            </p>
            <Button onClick={handleGenerate} size="lg">
              <Sparkles className="w-5 h-5 mr-2" />
              Получить рекомендации
            </Button>
          </div>
        )}

        {/* Loading state */}
        {isStreaming && displayIdeas.length === 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-gray-600">
              <div className="animate-spin">
                <RefreshCw className="w-5 h-5" />
              </div>
              <span>Генерируем финальные рекомендации...</span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SkeletonIdeaCard />
              <SkeletonIdeaCard />
            </div>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            <p>Ошибка при генерации: {error.message}</p>
            <Button variant="outline" onClick={handleGenerate} className="mt-2">
              Попробовать снова
            </Button>
          </div>
        )}

        {/* Success message and export */}
        {displayIdeas.length > 0 && !isStreaming && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-green-100 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-green-900 mb-1">
                  Готово! Ваши идеи сгенерированы
                </h3>
                <p className="text-green-700 mb-4">
                  Ниже представлены 10 персонализированных идей стартапов.
                  Сохраните их для дальнейшей работы.
                </p>
                <ExportButtons
                  data={{
                    selectedIndustries,
                    customInterests,
                    userBackground,
                    skills,
                    focusOfInterest,
                    finalRecommendations: displayIdeas,
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Ideas list */}
        {displayIdeas.length > 0 && (
          <>
            {/* Regenerate button */}
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">
                {displayIdeas.length} идей для вас
              </h2>
              <Button
                variant="outline"
                onClick={handleGenerate}
                disabled={isStreaming}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Сгенерировать заново
              </Button>
            </div>

            {/* Ideas grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {displayIdeas.map((idea, index) => (
                <DetailedIdeaCard key={idea.id} idea={idea} index={index} />
              ))}
            </div>

            {/* Streaming indicator */}
            {isStreaming && (
              <div className="text-center text-gray-500 text-sm">
                <span className="streaming-cursor">Генерация...</span>
              </div>
            )}
          </>
        )}

        {/* Start over */}
        {displayIdeas.length > 0 && (
          <div className="pt-6 border-t border-gray-200">
            <div className="flex justify-center">
              <Button variant="ghost" onClick={handleStartOver}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Начать заново
              </Button>
            </div>
          </div>
        )}
      </div>
    </WizardLayout>
  );
}
