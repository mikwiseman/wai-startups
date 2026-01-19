import { anthropic, MODEL_ID } from "@/lib/api/anthropic";
import { GENERATE_IDEAS_PROMPT } from "@/lib/constants/prompts";
import { INDUSTRIES } from "@/lib/constants/industries";
import startupsData from "@/lib/data/startups.json";
import { Project } from "@/types/project";

const projects = startupsData as Project[];

interface RequestBody {
  selectedIndustries: string[];
  customInterests: string[];
  userBackground: string;
  skills: string;
  focusOfInterest: string;
  likedProjects: { projectId: string; reason: string }[];
  dislikedProjects: { projectId: string; reason: string }[];
}

export async function POST(request: Request) {
  try {
    const body: RequestBody = await request.json();

    // Build the prompt with user data
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

    const prompt = GENERATE_IDEAS_PROMPT.replace("{industries}", industriesNames)
      .replace("{customInterests}", body.customInterests.join(", ") || "Нет")
      .replace("{userBackground}", body.userBackground || "Не указан")
      .replace("{skills}", body.skills)
      .replace("{focusOfInterest}", body.focusOfInterest)
      .replace("{likedProjects}", likedProjectsText || "Нет")
      .replace("{dislikedProjects}", dislikedProjectsText || "Нет");

    // Create a streaming response
    const stream = await anthropic.messages.stream({
      model: MODEL_ID,
      max_tokens: 4096,
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
    console.error("Error generating ideas:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate ideas" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
