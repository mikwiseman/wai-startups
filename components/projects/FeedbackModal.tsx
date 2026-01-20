"use client";

import { useState } from "react";
import { Modal, Button, Textarea } from "@/components/ui";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
  projectName: string;
  feedbackType: "like" | "dislike";
}

export function FeedbackModal({
  isOpen,
  onClose,
  onSubmit,
  projectName,
  feedbackType,
}: FeedbackModalProps) {
  const [reason, setReason] = useState("");

  const handleSubmit = () => {
    onSubmit(reason);
    setReason("");
    onClose();
  };

  const title =
    feedbackType === "like"
      ? `What do you like about ${projectName}?`
      : `What don't you like about ${projectName}?`;

  const placeholder =
    feedbackType === "like"
      ? "For example: Interesting business model, relevant problem..."
      : "For example: Too complex market, not my profile...";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="md">
      <div className="space-y-4">
        <Textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder={placeholder}
          rows={4}
          autoFocus
        />
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!reason.trim()}>
            Save
          </Button>
        </div>
      </div>
    </Modal>
  );
}
