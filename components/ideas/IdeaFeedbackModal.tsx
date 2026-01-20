"use client";

import { useState } from "react";
import { Modal, Button, Textarea } from "@/components/ui";

interface IdeaFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
  ideaName: string;
  feedbackType: "like" | "dislike";
}

export function IdeaFeedbackModal({
  isOpen,
  onClose,
  onSubmit,
  ideaName,
  feedbackType,
}: IdeaFeedbackModalProps) {
  const [reason, setReason] = useState("");

  const handleSubmit = () => {
    onSubmit(reason);
    setReason("");
    onClose();
  };

  const title =
    feedbackType === "like"
      ? `What do you like about "${ideaName}"?`
      : `What don't you like about "${ideaName}"?`;

  const placeholder =
    feedbackType === "like"
      ? "For example: Clear problem, interesting market, I can quickly create MVP..."
      : "For example: Too competitive market, not my expertise...";

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
