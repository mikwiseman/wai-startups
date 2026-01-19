import { anthropic, MODEL_ID } from "@/lib/api/anthropic";
import { FINAL_RECOMMENDATIONS_PROMPT } from "@/lib/constants/prompts";
import { INDUSTRIES } from "@/lib/constants/industries";
import startupsData from "@/lib/data/startups.json";
import { Project } from "@/types/project";
import { StartupIdea } from "@/types/wizard";

const projects = startupsData as Project[];

interface RequestBody {
  selectedIndustries: string[];
  customInterests: string[];
  userBackground: string;
  skills: string;
  focusOfInterest: string;
  likedProjects: { projectId: string; reason: string }[];
  dislikedProjects: { projectId: string; reason: string }[];
  generatedIdeas: StartupIdea[];
  likedIdeas: { ideaId: string; reason: string }[];
  dislikedIdeas: { ideaId: string; reason: string }[];
}

export async function POST(request: Request) {
  try {
    const body: RequestBody = await request.json();

    // Build the prompt with all user data
    const industriesNames = body.selectedIndustries
      .map((id) => INDUSTRIES.find((i) => i.id === id)?.name || id)
      .join(", ");

    const likedProjectsText = body.likedProjects
      .map((p) => {
        const project = projects.find((proj) => proj.id === p.projectId);
        return project
          ? `- ${project.name} (${project.industryCategory}): "${p.reason}"`
          : "";
      })
      .filter(Boolean)
      .join("\n");

    const dislikedProjectsText = body.dislikedProjects
      .map((p) => {
        const project = projects.find((proj) => proj.id === p.projectId);
        return project
          ? `- ${project.name} (${project.industryCategory}): "${p.reason}"`
          : "";
      })
      .filter(Boolean)
      .join("\n");

    const likedIdeasText = body.likedIdeas
      .map((i) => {
        const idea = body.generatedIdeas.find((idea) => idea.id === i.ideaId);
        return idea ? `- ${idea.name}: "${i.reason}"` : "";
      })
      .filter(Boolean)
      .join("\n");

    const dislikedIdeasText = body.dislikedIdeas
      .map((i) => {
        const idea = body.generatedIdeas.find((idea) => idea.id === i.ideaId);
        return idea ? `- ${idea.name}: "${i.reason}"` : "";
      })
      .filter(Boolean)
      .join("\n");

    const prompt = FINAL_RECOMMENDATIONS_PROMPT.replace(
      "{industries}",
      industriesNames
    )
      .replace("{customInterests}", body.customInterests.join(", ") || "Нет")
      .replace("{userBackground}", body.userBackground || "Не указан")
      .replace("{skills}", body.skills)
      .replace("{focusOfInterest}", body.focusOfInterest)
      .replace("{likedProjects}", likedProjectsText || "Нет")
      .replace("{dislikedProjects}", dislikedProjectsText || "Нет")
      .replace("{likedIdeas}", likedIdeasText || "Нет")
      .replace("{dislikedIdeas}", dislikedIdeasText || "Нет");

    // Create a streaming response
    const stream = await anthropic.messages.stream({
      model: MODEL_ID,
      max_tokens: 8192,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    // Return streaming response
    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        for await (const event of stream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        controller.close();
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    console.error("Error generating final recommendations:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate recommendations" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
