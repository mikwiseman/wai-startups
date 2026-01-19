export interface ProjectFeedback {
  projectId: string;
  reason: string;
}

export interface IdeaFeedback {
  ideaId: string;
  reason: string;
}

export interface WizardState {
  currentStep: number;
  completedSteps: number[];

  // Step 1: Interests
  selectedIndustries: string[];
  customInterests: string[];
  userBackground: string;

  // Step 2: Projects
  likedProjects: ProjectFeedback[];
  dislikedProjects: ProjectFeedback[];

  // Step 3: Profile
  skills: string;
  focusOfInterest: string;

  // Step 4: Ideas
  generatedIdeas: StartupIdea[];
  likedIdeas: IdeaFeedback[];
  dislikedIdeas: IdeaFeedback[];

  // Step 5: Final
  finalRecommendations: DetailedStartupIdea[];
}

export interface StartupIdea {
  id: string;
  name: string;
  problem: string;
  solution: string;
  whyNow: string;
}

export interface DetailedStartupIdea extends StartupIdea {
  competitiveAdvantage: string;
  mvp30Days: string[];
  firstGrowthChannel: string;
}

export interface WizardActions {
  // Navigation
  setCurrentStep: (step: number) => void;
  markStepCompleted: (step: number) => void;

  // Step 1
  toggleIndustry: (industry: string) => void;
  addCustomInterest: (interest: string) => void;
  removeCustomInterest: (interest: string) => void;
  setUserBackground: (background: string) => void;

  // Step 2
  addProjectFeedback: (
    projectId: string,
    isLiked: boolean,
    reason: string
  ) => void;
  removeProjectFeedback: (projectId: string) => void;

  // Step 3
  setSkills: (skills: string) => void;
  setFocusOfInterest: (focus: string) => void;

  // Step 4
  setGeneratedIdeas: (ideas: StartupIdea[]) => void;
  addIdeaFeedback: (ideaId: string, isLiked: boolean, reason: string) => void;
  removeIdeaFeedback: (ideaId: string) => void;

  // Step 5
  setFinalRecommendations: (ideas: DetailedStartupIdea[]) => void;

  // Reset
  resetWizard: () => void;
}
