"use client";

import { useState, useEffect } from "react";
import { WizardLayout, StepNavigation } from "@/components/wizard";
import { IdeaCard } from "@/components/ideas";
import { IdeaFeedbackModal } from "@/components/ideas/IdeaFeedbackModal";
import { Button, SkeletonIdeaCard, FunLoader } from "@/components/ui";
import { useWizardStore, useStep4Valid } from "@/store/useWizardStore";
import { useStreamingResponse, parseIdeasFromResponse } from "@/hooks/useStreamingResponse";
import { StartupIdea } from "@/types/wizard";
import { Sparkles, RefreshCw } from "lucide-react";

export default function Step4Page() {
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
    setGeneratedIdeas,
    addIdeaFeedback,
    removeIdeaFeedback,
    markStepCompleted,
  } = useWizardStore();

  const canContinue = useStep4Valid();
  const { response, isStreaming, error, startStreaming, reset } = useStreamingResponse();

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState<StartupIdea | null>(null);
  const [feedbackType, setFeedbackType] = useState<"like" | "dislike">("like");

  // Parse ideas from streaming response
  const [parsedIdeas, setParsedIdeas] = useState<StartupIdea[]>([]);

  useEffect(() => {
    if (response) {
      const ideas = parseIdeasFromResponse(response);
      if (ideas.length > 0) {
        setParsedIdeas(ideas);
      }
    }
  }, [response]);

  // Update store when streaming completes
  useEffect(() => {
    if (!isStreaming && parsedIdeas.length > 0 && generatedIdeas.length === 0) {
      setGeneratedIdeas(parsedIdeas);
    }
  }, [isStreaming, parsedIdeas, generatedIdeas.length, setGeneratedIdeas]);

  const handleGenerate = () => {
    reset();
    setParsedIdeas([]);
    setGeneratedIdeas([]);

    startStreaming("/api/claude/generate-ideas", {
      selectedIndustries,
      customInterests,
      userBackground,
      skills,
      focusOfInterest,
      likedProjects,
      dislikedProjects,
    });
  };

  const getFeedbackStatus = (ideaId: string) => {
    if (likedIdeas.some((i) => i.ideaId === ideaId)) return "liked";
    if (dislikedIdeas.some((i) => i.ideaId === ideaId)) return "disliked";
    return null;
  };

  const handleLike = (idea: StartupIdea) => {
    const currentStatus = getFeedbackStatus(idea.id);
    if (currentStatus === "liked") {
      removeIdeaFeedback(idea.id);
    } else {
      setSelectedIdea(idea);
      setFeedbackType("like");
      setModalOpen(true);
    }
  };

  const handleDislike = (idea: StartupIdea) => {
    const currentStatus = getFeedbackStatus(idea.id);
    if (currentStatus === "disliked") {
      removeIdeaFeedback(idea.id);
    } else {
      setSelectedIdea(idea);
      setFeedbackType("dislike");
      setModalOpen(true);
    }
  };

  const handleFeedbackSubmit = (reason: string) => {
    if (selectedIdea) {
      addIdeaFeedback(selectedIdea.id, feedbackType === "like", reason);
    }
  };

  const handleNext = () => {
    markStepCompleted(4);
  };

  // Use either stored ideas or parsed ideas
  const displayIdeas = generatedIdeas.length > 0 ? generatedIdeas : parsedIdeas;
  const totalFeedback = likedIdeas.length + dislikedIdeas.length;

  return (
    <WizardLayout
      title="Шаг 4: Генерация идей"
      description="ИИ сгенерирует персонализированные идеи на основе ваших предпочтений"
    >
      <div className="space-y-6">
        {/* Generate button */}
        {displayIdeas.length === 0 && !isStreaming && (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Готовы к генерации идей?
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              На основе ваших интересов, оценённых проектов и навыков ИИ
              создаст 5-7 уникальных идей стартапов
            </p>
            <Button onClick={handleGenerate} size="lg">
              <Sparkles className="w-5 h-5 mr-2" />
              Сгенерировать идеи
            </Button>
          </div>
        )}

        {/* Loading state */}
        {isStreaming && displayIdeas.length === 0 && (
          <div className="space-y-4">
            <FunLoader />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SkeletonIdeaCard />
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

        {/* Ideas list */}
        {displayIdeas.length > 0 && (
          <>
            {/* Progress indicator */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Оцените идеи
                </span>
                <span className="text-sm text-gray-500">
                  {totalFeedback} из 2 минимум
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gray-900 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min((totalFeedback / 2) * 100, 100)}%` }}
                />
              </div>
              <div className="flex gap-4 mt-3 text-sm">
                <span className="text-green-600">
                  👍 Нравится: {likedIdeas.length}
                </span>
                <span className="text-red-500">
                  👎 Не нравится: {dislikedIdeas.length}
                </span>
              </div>
            </div>

            {/* Regenerate button */}
            <div className="flex justify-end">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {displayIdeas.map((idea, index) => (
                <IdeaCard
                  key={idea.id}
                  idea={idea}
                  index={index}
                  feedbackStatus={getFeedbackStatus(idea.id)}
                  onLike={() => handleLike(idea)}
                  onDislike={() => handleDislike(idea)}
                />
              ))}
            </div>

            {/* Streaming indicator */}
            {isStreaming && (
              <div className="flex justify-center">
                <FunLoader />
              </div>
            )}
          </>
        )}

        {/* Validation message */}
        {displayIdeas.length > 0 && !canContinue && (
          <p className="text-sm text-orange-600">
            Оцените минимум 2 идеи, чтобы продолжить
          </p>
        )}

        <StepNavigation
          currentStep={4}
          canContinue={canContinue && displayIdeas.length > 0}
          onNext={handleNext}
        />
      </div>

      {/* Feedback Modal */}
      {selectedIdea && (
        <IdeaFeedbackModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleFeedbackSubmit}
          ideaName={selectedIdea.name}
          feedbackType={feedbackType}
        />
      )}
    </WizardLayout>
  );
}
