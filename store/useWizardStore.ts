import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  WizardState,
  WizardActions,
  StartupIdea,
  DetailedStartupIdea,
} from "@/types/wizard";

const initialState: WizardState = {
  currentStep: 1,
  completedSteps: [],

  // Step 1
  selectedIndustries: [],
  customInterests: [],
  userBackground: "",

  // Step 2
  likedProjects: [],
  dislikedProjects: [],

  // Step 3
  skills: "",
  focusOfInterest: "",

  // Step 4
  generatedIdeas: [],
  likedIdeas: [],
  dislikedIdeas: [],

  // Step 5
  finalRecommendations: [],
};

export const useWizardStore = create<WizardState & WizardActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Navigation
      setCurrentStep: (step: number) => set({ currentStep: step }),

      markStepCompleted: (step: number) =>
        set((state) => ({
          completedSteps: state.completedSteps.includes(step)
            ? state.completedSteps
            : [...state.completedSteps, step],
        })),

      // Step 1: Industries & Interests
      toggleIndustry: (industry: string) =>
        set((state) => ({
          selectedIndustries: state.selectedIndustries.includes(industry)
            ? state.selectedIndustries.filter((i) => i !== industry)
            : [...state.selectedIndustries, industry],
        })),

      addCustomInterest: (interest: string) =>
        set((state) => ({
          customInterests: state.customInterests.includes(interest)
            ? state.customInterests
            : [...state.customInterests, interest],
        })),

      removeCustomInterest: (interest: string) =>
        set((state) => ({
          customInterests: state.customInterests.filter((i) => i !== interest),
        })),

      setUserBackground: (background: string) =>
        set({ userBackground: background }),

      // Step 2: Project Feedback
      addProjectFeedback: (
        projectId: string,
        isLiked: boolean,
        reason: string
      ) =>
        set((state) => {
          // Remove from both lists first
          const newLikedProjects = state.likedProjects.filter(
            (p) => p.projectId !== projectId
          );
          const newDislikedProjects = state.dislikedProjects.filter(
            (p) => p.projectId !== projectId
          );

          // Add to appropriate list
          if (isLiked) {
            return {
              likedProjects: [...newLikedProjects, { projectId, reason }],
              dislikedProjects: newDislikedProjects,
            };
          } else {
            return {
              likedProjects: newLikedProjects,
              dislikedProjects: [...newDislikedProjects, { projectId, reason }],
            };
          }
        }),

      removeProjectFeedback: (projectId: string) =>
        set((state) => ({
          likedProjects: state.likedProjects.filter(
            (p) => p.projectId !== projectId
          ),
          dislikedProjects: state.dislikedProjects.filter(
            (p) => p.projectId !== projectId
          ),
        })),

      // Step 3: Profile
      setSkills: (skills: string) => set({ skills }),
      setFocusOfInterest: (focus: string) => set({ focusOfInterest: focus }),

      // Step 4: Generated Ideas
      setGeneratedIdeas: (ideas: StartupIdea[]) =>
        set({ generatedIdeas: ideas }),

      addIdeaFeedback: (ideaId: string, isLiked: boolean, reason: string) =>
        set((state) => {
          // Remove from both lists first
          const newLikedIdeas = state.likedIdeas.filter(
            (i) => i.ideaId !== ideaId
          );
          const newDislikedIdeas = state.dislikedIdeas.filter(
            (i) => i.ideaId !== ideaId
          );

          // Add to appropriate list
          if (isLiked) {
            return {
              likedIdeas: [...newLikedIdeas, { ideaId, reason }],
              dislikedIdeas: newDislikedIdeas,
            };
          } else {
            return {
              likedIdeas: newLikedIdeas,
              dislikedIdeas: [...newDislikedIdeas, { ideaId, reason }],
            };
          }
        }),

      removeIdeaFeedback: (ideaId: string) =>
        set((state) => ({
          likedIdeas: state.likedIdeas.filter((i) => i.ideaId !== ideaId),
          dislikedIdeas: state.dislikedIdeas.filter((i) => i.ideaId !== ideaId),
        })),

      // Step 5: Final Recommendations
      setFinalRecommendations: (ideas: DetailedStartupIdea[]) =>
        set({ finalRecommendations: ideas }),

      // Reset
      resetWizard: () => set(initialState),
    }),
    {
      name: "wai-startups-wizard",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Persist everything except transient state
        currentStep: state.currentStep,
        completedSteps: state.completedSteps,
        selectedIndustries: state.selectedIndustries,
        customInterests: state.customInterests,
        userBackground: state.userBackground,
        likedProjects: state.likedProjects,
        dislikedProjects: state.dislikedProjects,
        skills: state.skills,
        focusOfInterest: state.focusOfInterest,
        generatedIdeas: state.generatedIdeas,
        likedIdeas: state.likedIdeas,
        dislikedIdeas: state.dislikedIdeas,
        finalRecommendations: state.finalRecommendations,
      }),
    }
  )
);

// Selectors for step validation
export const useStep1Valid = () =>
  useWizardStore(
    (state) =>
      state.selectedIndustries.length > 0 || state.customInterests.length > 0
  );

export const useStep2Valid = () =>
  useWizardStore(
    (state) =>
      state.likedProjects.length + state.dislikedProjects.length >= 3
  );

export const useStep3Valid = () =>
  useWizardStore(
    (state) => state.skills.length >= 50 && state.focusOfInterest.length >= 50
  );

export const useStep4Valid = () =>
  useWizardStore(
    (state) => state.likedIdeas.length + state.dislikedIdeas.length >= 2
  );
