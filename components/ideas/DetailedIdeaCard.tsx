"use client";

import { DetailedStartupIdea } from "@/types/wizard";
import { Trophy, Target, Lightbulb, Clock, Rocket, TrendingUp } from "lucide-react";

interface DetailedIdeaCardProps {
  idea: DetailedStartupIdea;
  index: number;
}

export function DetailedIdeaCard({ idea, index }: DetailedIdeaCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gray-900 text-white px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
          <h3 className="text-xl font-semibold">{idea.name}</h3>
        </div>
      </div>

      {/* Content */}
      <div className="divide-y divide-gray-100">
        <div className="p-5 flex items-start gap-3">
          <div className="p-2 bg-red-100 rounded-lg shrink-0">
            <Target className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Проблема</p>
            <p className="text-gray-800">{idea.problem}</p>
          </div>
        </div>

        <div className="p-5 flex items-start gap-3">
          <div className="p-2 bg-green-100 rounded-lg shrink-0">
            <Lightbulb className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Решение</p>
            <p className="text-gray-800">{idea.solution}</p>
          </div>
        </div>

        <div className="p-5 flex items-start gap-3">
          <div className="p-2 bg-blue-100 rounded-lg shrink-0">
            <Clock className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Почему сейчас</p>
            <p className="text-gray-800">{idea.whyNow}</p>
          </div>
        </div>

        <div className="p-5 flex items-start gap-3">
          <div className="p-2 bg-yellow-100 rounded-lg shrink-0">
            <Trophy className="w-5 h-5 text-yellow-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">
              Конкурентное преимущество
            </p>
            <p className="text-gray-800 font-medium">{idea.competitiveAdvantage}</p>
          </div>
        </div>

        <div className="p-5 flex items-start gap-3">
          <div className="p-2 bg-purple-100 rounded-lg shrink-0">
            <Rocket className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-2">MVP за 30 дней</p>
            <ul className="space-y-1.5">
              {idea.mvp30Days.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-gray-800">
                  <span className="text-purple-600 mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="p-5 flex items-start gap-3">
          <div className="p-2 bg-orange-100 rounded-lg shrink-0">
            <TrendingUp className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">
              Первый канал роста
            </p>
            <p className="text-gray-800">{idea.firstGrowthChannel}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
