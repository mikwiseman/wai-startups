"use client";

import { useState, useMemo } from "react";
import { WizardLayout, StepNavigation } from "@/components/wizard";
import { ProjectCard, FeedbackModal } from "@/components/projects";
import { Input, Badge, Button } from "@/components/ui";
import { useWizardStore, useStep2Valid } from "@/store/useWizardStore";
import { Project } from "@/types/project";
import startupsData from "@/lib/data/startups.json";
import { Search, Filter, X } from "lucide-react";

const projects = startupsData as Project[];

export default function Step2Page() {
  const {
    selectedIndustries,
    likedProjects,
    dislikedProjects,
    addProjectFeedback,
    removeProjectFeedback,
    markStepCompleted,
  } = useWizardStore();

  const canContinue = useStep2Valid();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStages, setSelectedStages] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [feedbackType, setFeedbackType] = useState<"like" | "dislike">("like");

  // Filter projects based on selected industries and search
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      // Filter by selected industries
      if (selectedIndustries.length > 0) {
        if (!selectedIndustries.includes(project.industry)) {
          return false;
        }
      }

      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          project.name.toLowerCase().includes(query) ||
          project.description.toLowerCase().includes(query) ||
          project.tags.some((tag) => tag.toLowerCase().includes(query));
        if (!matchesSearch) return false;
      }

      // Filter by stage
      if (selectedStages.length > 0) {
        if (!selectedStages.includes(project.stage)) {
          return false;
        }
      }

      return true;
    });
  }, [selectedIndustries, searchQuery, selectedStages]);

  const getFeedbackStatus = (projectId: string) => {
    if (likedProjects.some((p) => p.projectId === projectId)) return "liked";
    if (dislikedProjects.some((p) => p.projectId === projectId))
      return "disliked";
    return null;
  };

  const handleLike = (project: Project) => {
    const currentStatus = getFeedbackStatus(project.id);
    if (currentStatus === "liked") {
      removeProjectFeedback(project.id);
    } else {
      setSelectedProject(project);
      setFeedbackType("like");
      setModalOpen(true);
    }
  };

  const handleDislike = (project: Project) => {
    const currentStatus = getFeedbackStatus(project.id);
    if (currentStatus === "disliked") {
      removeProjectFeedback(project.id);
    } else {
      setSelectedProject(project);
      setFeedbackType("dislike");
      setModalOpen(true);
    }
  };

  const handleFeedbackSubmit = (reason: string) => {
    if (selectedProject) {
      addProjectFeedback(selectedProject.id, feedbackType === "like", reason);
    }
  };

  const handleNext = () => {
    markStepCompleted(2);
  };

  const stages = ["Pre-seed", "Seed", "Series A", "Series B", "Series C", "Growth"];
  const totalFeedback = likedProjects.length + dislikedProjects.length;

  return (
    <WizardLayout
      title="Step 2: Market Research"
      description="Rate existing projects to help us understand your preferences"
    >
      <div className="space-y-6">
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or tags..."
              className="pl-10"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="shrink-0"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
            {selectedStages.length > 0 && (
              <Badge variant="info" size="sm" className="ml-2">
                {selectedStages.length}
              </Badge>
            )}
          </Button>
        </div>

        {/* Stage Filters */}
        {showFilters && (
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Stage</span>
              {selectedStages.length > 0 && (
                <button
                  onClick={() => setSelectedStages([])}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Reset
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {stages.map((stage) => (
                <button
                  key={stage}
                  onClick={() =>
                    setSelectedStages((prev) =>
                      prev.includes(stage)
                        ? prev.filter((s) => s !== stage)
                        : [...prev, stage]
                    )
                  }
                  className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                    selectedStages.includes(stage)
                      ? "bg-gray-900 text-white"
                      : "bg-white border border-gray-300 text-gray-700 hover:border-gray-400"
                  }`}
                >
                  {stage}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Progress indicator */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Your Progress
            </span>
            <span className="text-sm text-gray-500">
              {totalFeedback} of 3 minimum
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gray-900 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min((totalFeedback / 3) * 100, 100)}%` }}
            />
          </div>
          <div className="flex gap-4 mt-3 text-sm">
            <span className="text-green-600">
              👍 Liked: {likedProjects.length}
            </span>
            <span className="text-red-500">
              👎 Disliked: {dislikedProjects.length}
            </span>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              feedbackStatus={getFeedbackStatus(project.id)}
              onLike={() => handleLike(project)}
              onDislike={() => handleDislike(project)}
            />
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p>No projects found. Try changing the filters.</p>
          </div>
        )}

        {/* Validation message */}
        {!canContinue && (
          <p className="text-sm text-orange-600">
            Rate at least 3 projects to continue
          </p>
        )}

        <StepNavigation
          currentStep={2}
          canContinue={canContinue}
          onNext={handleNext}
        />
      </div>

      {/* Feedback Modal */}
      {selectedProject && (
        <FeedbackModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleFeedbackSubmit}
          projectName={selectedProject.name}
          feedbackType={feedbackType}
        />
      )}
    </WizardLayout>
  );
}
