"use client";

import { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";

const LOADING_MESSAGES = [
  { emoji: "🧠", text: "Анализируем рынок..." },
  { emoji: "💡", text: "Генерируем идеи..." },
  { emoji: "🚀", text: "Соединяемся с космосом..." },
  { emoji: "🔮", text: "Консультируемся с оракулом..." },
  { emoji: "⚡", text: "Активируем нейросети..." },
  { emoji: "🎯", text: "Ищем product-market fit..." },
  { emoji: "🦄", text: "Приманиваем единорогов..." },
  { emoji: "📊", text: "Считаем юнит-экономику..." },
  { emoji: "🌟", text: "Добавляем щепотку магии..." },
  { emoji: "🎪", text: "Жонглируем бизнес-моделями..." },
];

interface FunLoaderProps {
  interval?: number;
}

export function FunLoader({ interval = 2500 }: FunLoaderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
        setIsTransitioning(false);
      }, 300);
    }, interval);

    return () => clearInterval(timer);
  }, [interval]);

  const currentMessage = LOADING_MESSAGES[currentIndex];

  return (
    <div className="flex items-center gap-3 text-gray-600">
      <div className="animate-spin">
        <RefreshCw className="w-5 h-5" />
      </div>
      <div
        className={`flex items-center gap-2 transition-opacity duration-300 ${
          isTransitioning ? "opacity-0" : "opacity-100"
        }`}
      >
        <span className="text-xl">{currentMessage.emoji}</span>
        <span>{currentMessage.text}</span>
      </div>
    </div>
  );
}
