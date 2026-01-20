"use client";

import { cn } from "@/lib/utils/cn";
import { Badge, Button } from "@/components/ui";
import { ThumbsUp, ThumbsDown, ExternalLink, Users, Calendar, MapPin, Briefcase, GraduationCap } from "lucide-react";

// Extended project type to include batch
interface ProjectWithBatch {
  id: string;
  name: string;
  website?: string;
  description: string;
  industry: string;
  industryCategory: string;
  country: string;
  region: string;
  foundingYear: number;
  employees: number;
  employeeRange: string;
  stage: string;
  funding: number;
  fundingDisplay: string;
  techStack: string[];
  tags: string[];
  batch?: string;
  source?: string;
}

interface ProjectCardProps {
  project: ProjectWithBatch;
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
        "bg-white rounded-xl border-2 p-5 transition-all duration-200 flex flex-col",
        feedbackStatus === "liked" && "border-green-500 bg-green-50/50",
        feedbackStatus === "disliked" && "border-red-400 bg-red-50/50",
        !feedbackStatus && "border-gray-200 hover:border-gray-300"
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          {feedbackStatus && (
            <Badge
              variant={feedbackStatus === "liked" ? "success" : "danger"}
              size="sm"
            >
              {feedbackStatus === "liked" ? "Liked" : "Disliked"}
            </Badge>
          )}
          {project.batch && (
            <Badge variant="info" size="sm">
              <GraduationCap className="w-3 h-3 mr-1" />
              YC {project.batch}
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

      {/* Industry & Location */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-3 flex-wrap">
        <span>{project.industryCategory}</span>
        <span className="text-gray-300">•</span>
        <span className="flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          {project.country}
        </span>
      </div>

      {/* Description */}
      <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">{project.description}</p>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
        <div className="flex items-center gap-1.5 text-gray-600">
          <Users className="w-4 h-4 text-gray-400" />
          <span>{project.employeeRange} people</span>
        </div>
        <div className="flex items-center gap-1.5 text-gray-600">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span>Since {project.foundingYear}</span>
        </div>
        <div className="flex items-center gap-1.5 text-gray-600">
          <Briefcase className="w-4 h-4 text-gray-400" />
          <Badge variant="outline" size="sm">{project.stage}</Badge>
        </div>
        <div className="flex items-center gap-1.5 text-gray-600 text-xs">
          <span className="text-gray-400">{project.region}</span>
        </div>
      </div>

      {/* Tech Stack (if available) */}
      {project.techStack && project.techStack.length > 0 && (
        <div className="mb-3">
          <p className="text-xs text-gray-400 mb-1.5">Technologies:</p>
          <div className="flex flex-wrap gap-1">
            {project.techStack.map((tech) => (
              <Badge key={tech} variant="outline" size="sm" className="text-xs">
                {tech}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Tags - show all */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {project.tags.map((tag) => (
          <Badge key={tag} variant="default" size="sm">
            {tag}
          </Badge>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-3 border-t border-gray-100 mt-auto">
        <Button
          variant={feedbackStatus === "liked" ? "primary" : "outline"}
          size="sm"
          onClick={onLike}
          className="flex-1"
        >
          <ThumbsUp className="w-4 h-4 mr-1.5" />
          Like
        </Button>
        <Button
          variant={feedbackStatus === "disliked" ? "danger" : "outline"}
          size="sm"
          onClick={onDislike}
          className="flex-1"
        >
          <ThumbsDown className="w-4 h-4 mr-1.5" />
          Dislike
        </Button>
      </div>
    </div>
  );
}
