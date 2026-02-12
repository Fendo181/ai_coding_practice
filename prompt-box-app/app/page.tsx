"use client";

import { useState, useEffect } from "react";
import PromptForm from "@/components/PromptForm";
import PromptList from "@/components/PromptList";
import { Prompt, Answer } from "@/lib/types";
import { storage } from "@/lib/storage";

export default function Home() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);

  useEffect(() => {
    setPrompts(storage.getPrompts());
  }, []);

  const handleAddPrompt = (title: string, createdBy: string) => {
    const newPrompt: Prompt = {
      id: Date.now().toString(),
      title,
      createdBy,
      createdAt: new Date().toISOString(),
      answers: [],
    };
    storage.addPrompt(newPrompt);
    setPrompts(storage.getPrompts());
  };

  const handleAddAnswer = (promptId: string, content: string, answeredBy: string) => {
    const prompt = prompts.find((p) => p.id === promptId);
    if (prompt) {
      const newAnswer: Answer = {
        id: Date.now().toString(),
        promptId,
        content,
        answeredBy,
        createdAt: new Date().toISOString(),
      };
      const updatedPrompt: Prompt = {
        ...prompt,
        answers: [...prompt.answers, newAnswer],
      };
      storage.updatePrompt(promptId, updatedPrompt);
      setPrompts(storage.getPrompts());
    }
  };

  const handleDeletePrompt = (promptId: string) => {
    if (confirm("本当にこのお題を削除しますか？")) {
      storage.deletePrompt(promptId);
      setPrompts(storage.getPrompts());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">
            お題ボックス
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            お題を共有して、みんなで回答を楽しもう！
          </p>
        </header>

        <main>
          <PromptForm onSubmit={handleAddPrompt} />
          <PromptList
            prompts={prompts}
            onAddAnswer={handleAddAnswer}
            onDelete={handleDeletePrompt}
          />
        </main>

        <footer className="mt-12 text-center text-gray-600 dark:text-gray-400">
          <p className="text-sm">
            Built with Next.js 14, TypeScript, and Tailwind CSS
          </p>
        </footer>
      </div>
    </div>
  );
}
