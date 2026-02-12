"use client";

import { useState } from "react";

interface PromptFormProps {
  onSubmit: (title: string, createdBy: string) => void;
}

export default function PromptForm({ onSubmit }: PromptFormProps) {
  const [title, setTitle] = useState("");
  const [createdBy, setCreatedBy] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && createdBy.trim()) {
      onSubmit(title.trim(), createdBy.trim());
      setTitle("");
      setCreatedBy("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
        新しいお題を追加
      </h2>
      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          お題
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="例: 今年の目標は？"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="createdBy" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          あなたの名前
        </label>
        <input
          type="text"
          id="createdBy"
          value={createdBy}
          onChange={(e) => setCreatedBy(e.target.value)}
          placeholder="例: 山田太郎"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
      >
        お題を追加
      </button>
    </form>
  );
}
