"use client";

import { useState } from "react";
import { Button } from "@/components/ui";
import { FileJson, FileText, Copy, Check } from "lucide-react";
import { DetailedStartupIdea } from "@/types/wizard";

interface ExportData {
  selectedIndustries: string[];
  customInterests: string[];
  userBackground: string;
  skills: string;
  focusOfInterest: string;
  finalRecommendations: DetailedStartupIdea[];
  exportedAt: string;
}

interface ExportButtonsProps {
  data: Omit<ExportData, "exportedAt">;
}

export function formatIdeaAsText(idea: DetailedStartupIdea, index?: number): string {
  let content = "";
  if (index !== undefined) {
    content += `${index + 1}. ${idea.name}\n`;
    content += "-".repeat(40) + "\n";
  } else {
    content += `${idea.name}\n`;
    content += "-".repeat(40) + "\n";
  }
  content += `Problem: ${idea.problem}\n`;
  content += `Solution: ${idea.solution}\n`;
  content += `Why Now: ${idea.whyNow}\n`;
  content += `Advantage: ${idea.competitiveAdvantage}\n`;
  content += `MVP in 30 Days:\n`;
  idea.mvp30Days.forEach((item) => {
    content += `  • ${item}\n`;
  });
  content += `Growth Channel: ${idea.firstGrowthChannel}\n`;
  return content;
}

export function ExportButtons({ data }: ExportButtonsProps) {
  const [copied, setCopied] = useState(false);

  const generateTextContent = () => {
    let content = "STARTUP IDEA GENERATOR\n";
    content += "=".repeat(50) + "\n\n";
    content += `Date: ${new Date().toLocaleDateString("en-US")}\n\n`;

    content += "PROFILE\n";
    content += "-".repeat(30) + "\n";
    content += `Industries: ${data.selectedIndustries.join(", ")}\n`;
    if (data.customInterests.length > 0) {
      content += `Additional interests: ${data.customInterests.join(", ")}\n`;
    }
    content += `\nSkills:\n${data.skills}\n`;
    content += `\nFocus:\n${data.focusOfInterest}\n\n`;

    content += "RECOMMENDED IDEAS\n";
    content += "=".repeat(50) + "\n\n";

    data.finalRecommendations.forEach((idea, index) => {
      content += formatIdeaAsText(idea, index) + "\n";
    });

    return content;
  };

  const handleCopyAll = async () => {
    const content = generateTextContent();
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleExportJSON = () => {
    const exportData: ExportData = {
      ...data,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `startup-ideas-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportText = () => {
    const content = generateTextContent();

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `startup-ideas-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-wrap gap-3">
      <Button variant="outline" onClick={handleCopyAll}>
        {copied ? (
          <Check className="w-4 h-4 mr-2 text-green-600" />
        ) : (
          <Copy className="w-4 h-4 mr-2" />
        )}
        {copied ? "Copied!" : "Copy All"}
      </Button>
      <Button variant="outline" onClick={handleExportJSON}>
        <FileJson className="w-4 h-4 mr-2" />
        Download JSON
      </Button>
      <Button variant="outline" onClick={handleExportText}>
        <FileText className="w-4 h-4 mr-2" />
        Download TXT
      </Button>
    </div>
  );
}
