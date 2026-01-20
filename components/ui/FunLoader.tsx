"use client";

import { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";

const LOADING_MESSAGES = [
  { emoji: "🧠", text: "Analyzing market..." },
  { emoji: "💡", text: "Generating ideas..." },
  { emoji: "🚀", text: "Connecting to the cosmos..." },
  { emoji: "🔮", text: "Consulting the oracle..." },
  { emoji: "⚡", text: "Activating neural networks..." },
  { emoji: "🎯", text: "Finding product-market fit..." },
  { emoji: "🦄", text: "Attracting unicorns..." },
  { emoji: "📊", text: "Calculating unit economics..." },
  { emoji: "🌟", text: "Adding a pinch of magic..." },
  { emoji: "🎪", text: "Juggling business models..." },
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
