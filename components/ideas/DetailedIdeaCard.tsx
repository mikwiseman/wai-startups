"use client";

import { useState } from "react";
import { DetailedStartupIdea } from "@/types/wizard";
import { Trophy, Target, Lightbulb, Clock, Rocket, TrendingUp, Copy, FileJson, FileText, Check } from "lucide-react";
import { formatIdeaAsText } from "@/components/export/ExportButtons";

interface DetailedIdeaCardProps {
  idea: DetailedStartupIdea;
  index: number;
}

export function DetailedIdeaCard({ idea, index }: DetailedIdeaCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const content = formatIdeaAsText(idea);
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(idea, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `idea-${idea.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportText = () => {
    const content = formatIdeaAsText(idea);
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `idea-${idea.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gray-900 text-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
            <h3 className="text-xl font-semibold">{idea.name}</h3>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handleCopy}
              className="p-1.5 text-gray-400 hover:text-white transition-colors rounded"
              title="Скопировать"
            >
              {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              onClick={handleExportJSON}
              className="p-1.5 text-gray-400 hover:text-white transition-colors rounded"
              title="Скачать JSON"
            >
              <FileJson className="w-4 h-4" />
            </button>
            <button
              onClick={handleExportText}
              className="p-1.5 text-gray-400 hover:text-white transition-colors rounded"
              title="Скачать TXT"
            >
              <FileText className="w-4 h-4" />
            </button>
          </div>
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
