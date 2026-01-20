"use client";

import { cn } from "@/lib/utils/cn";
import { Project } from "@/types/project";
import { Badge, Button } from "@/components/ui";
import { ThumbsUp, ThumbsDown, ExternalLink, Users, Calendar, DollarSign } from "lucide-react";

interface ProjectCardProps {
  project: Project;
  feedbackStatus?: "liked" | "disliked" | null;
  onLike: () => void;
  onDislike: () => void;
}

export function ProjectCard({
  project,
  feedbackStatus,
  onLike,
  onDislike,
}: ProjectCardProps) {
  const industryIcons: Record<string, string> = {
    fintech: "💳",
    healthtech: "🏥",
    edtech: "📚",
    ecommerce: "🛒",
    saas: "☁️",
    "ai-ml": "🤖",
    logistics: "🚚",
    proptech: "🏠",
    foodtech: "🍔",
    greentech: "🌱",
    hrtech: "👥",
    legaltech: "⚖️",
    insurtech: "🛡️",
    traveltech: "✈️",
    cybersecurity: "🔒",
    gaming: "🎮",
    social: "💬",
    marketplaces: "🏪",
    devtools: "🛠️",
    "crypto-web3": "⛓️",
    mediatech: "🎬",
    agrotech: "🌾",
  };

  return (
    <div
      className={cn(
        "bg-white rounded-xl border-2 p-5 transition-all duration-200",
        feedbackStatus === "liked" && "border-green-500 bg-green-50/50",
        feedbackStatus === "disliked" && "border-red-400 bg-red-50/50",
        !feedbackStatus && "border-gray-200 hover:border-gray-300"
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {feedbackStatus && (
            <Badge
              variant={feedbackStatus === "liked" ? "success" : "danger"}
              size="sm"
            >
              {feedbackStatus === "liked" ? "Нравится" : "Не нравится"}
            </Badge>
          )}
        </div>
        <span className="text-2xl">{industryIcons[project.industry] || "🚀"}</span>
      </div>

      {/* Title & Industry */}
      {project.website ? (
        <a
          href={project.website}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-1.5 mb-1"
        >
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 group-hover:underline transition-colors">
            {project.name}
          </h3>
          <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
        </a>
      ) : (
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{project.name}</h3>
      )}
      <p className="text-sm text-gray-500 mb-3">{project.industryCategory}</p>

      {/* Description */}
      <p className="text-gray-600 text-sm mb-4 line-clamp-3">{project.description}</p>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="flex items-center gap-1.5 text-sm text-gray-600">
          <Users className="w-4 h-4 text-gray-400" />
          <span>{project.employeeRange}</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-gray-600">
          <DollarSign className="w-4 h-4 text-gray-400" />
          <span>{project.fundingDisplay}</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-gray-600">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span>{project.foundingYear}</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-gray-600">
          <Badge variant="outline" size="sm">{project.stage}</Badge>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {project.tags.slice(0, 4).map((tag) => (
          <Badge key={tag} variant="default" size="sm">
            {tag}
          </Badge>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
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
        {project.website && (
          <a
            href={project.website}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>
    </div>
  );
}
