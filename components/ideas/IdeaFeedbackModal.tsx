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
      ? `Что вам нравится в "${ideaName}"?`
      : `Что вам не нравится в "${ideaName}"?`;

  const placeholder =
    feedbackType === "like"
      ? "Например: Понятная проблема, интересный рынок, могу быстро создать MVP..."
      : "Например: Слишком конкурентный рынок, не моя экспертиза...";

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
            Отмена
          </Button>
          <Button onClick={handleSubmit} disabled={!reason.trim()}>
            Сохранить
          </Button>
        </div>
      </div>
    </Modal>
  );
}
