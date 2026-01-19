"use client";

import { useState, useCallback } from "react";

interface UseStreamingResponseOptions {
  onComplete?: (response: string) => void;
  onError?: (error: Error) => void;
}

export function useStreamingResponse(options: UseStreamingResponseOptions = {}) {
  const [response, setResponse] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const startStreaming = useCallback(
    async (url: string, body: object) => {
      setIsStreaming(true);
      setResponse("");
      setError(null);

      try {
        const res = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const reader = res.body?.getReader();
        if (!reader) {
          throw new Error("No reader available");
        }

        const decoder = new TextDecoder();
        let fullResponse = "";

        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            break;
          }

          const chunk = decoder.decode(value, { stream: true });
          fullResponse += chunk;
          setResponse(fullResponse);
        }

        setIsStreaming(false);
        options.onComplete?.(fullResponse);
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Unknown error");
        setError(error);
        setIsStreaming(false);
        options.onError?.(error);
      }
    },
    [options]
  );

  const reset = useCallback(() => {
    setResponse("");
    setError(null);
    setIsStreaming(false);
  }, []);

  return {
    response,
    isStreaming,
    error,
    startStreaming,
    reset,
  };
}

// Helper to parse JSON from streaming response
export function parseIdeasFromResponse(response: string) {
  try {
    // Try to extract JSON from the response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return parsed.ideas || [];
    }
    return [];
  } catch {
    return [];
  }
}
