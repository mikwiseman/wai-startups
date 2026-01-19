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
      ? `Что вам нравится в ${projectName}?`
      : `Что вам не нравится в ${projectName}?`;

  const placeholder =
    feedbackType === "like"
      ? "Например: Интересная бизнес-модель, актуальная проблема..."
      : "Например: Слишком сложный рынок, не мой профиль...";

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
