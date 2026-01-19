"use client";

import { cn } from "@/lib/utils/cn";
import { StartupIdea } from "@/types/wizard";
import { Badge, Button } from "@/components/ui";
import { ThumbsUp, ThumbsDown, Lightbulb, Target, Clock } from "lucide-react";

interface IdeaCardProps {
  idea: StartupIdea;
  index: number;
  feedbackStatus?: "liked" | "disliked" | null;
  onLike: () => void;
  onDislike: () => void;
}

export function IdeaCard({
  idea,
  index,
  feedbackStatus,
  onLike,
  onDislike,
}: IdeaCardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-xl border-2 p-6 transition-all duration-200",
        feedbackStatus === "liked" && "border-green-500 bg-green-50/50",
        feedbackStatus === "disliked" && "border-red-400 bg-red-50/50",
        !feedbackStatus && "border-gray-200 hover:border-gray-300"
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
          <h3 className="text-lg font-semibold text-gray-900">{idea.name}</h3>
        </div>
        {feedbackStatus && (
          <Badge variant={feedbackStatus === "liked" ? "success" : "danger"}>
            {feedbackStatus === "liked" ? "Нравится" : "Не нравится"}
          </Badge>
        )}
      </div>

      {/* Content */}
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="p-1.5 bg-red-100 rounded">
            <Target className="w-4 h-4 text-red-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Проблема</p>
            <p className="text-gray-700">{idea.problem}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-1.5 bg-green-100 rounded">
            <Lightbulb className="w-4 h-4 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Решение</p>
            <p className="text-gray-700">{idea.solution}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-1.5 bg-blue-100 rounded">
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Почему сейчас</p>
            <p className="text-gray-700">{idea.whyNow}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 mt-6 pt-4 border-t border-gray-100">
        <Button
          variant={feedbackStatus === "liked" ? "primary" : "outline"}
          size="sm"
          onClick={onLike}
          className="flex-1"
        >
          <ThumbsUp className="w-4 h-4 mr-1.5" />
          Нравится
        </Button>
        <Button
          variant={feedbackStatus === "disliked" ? "danger" : "outline"}
          size="sm"
          onClick={onDislike}
          className="flex-1"
        >
          <ThumbsDown className="w-4 h-4 mr-1.5" />
          Не нравится
        </Button>
      </div>
    </div>
  );
}
