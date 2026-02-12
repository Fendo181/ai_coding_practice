"use client";

import { Prompt } from "@/lib/types";
import PromptCard from "./PromptCard";

interface PromptListProps {
  prompts: Prompt[];
  onAddAnswer: (promptId: string, content: string, answeredBy: string) => void;
  onDelete: (promptId: string) => void;
}

export default function PromptList({ prompts, onAddAnswer, onDelete }: PromptListProps) {
  if (prompts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          まだお題がありません。新しいお題を追加してみましょう！
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {prompts.map((prompt) => (
        <PromptCard
          key={prompt.id}
          prompt={prompt}
          onAddAnswer={onAddAnswer}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
