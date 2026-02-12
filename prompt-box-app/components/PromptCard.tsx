"use client";

import { useState } from "react";
import { Prompt, Answer } from "@/lib/types";

interface PromptCardProps {
  prompt: Prompt;
  onAddAnswer: (promptId: string, content: string, answeredBy: string) => void;
  onDelete: (promptId: string) => void;
}

export default function PromptCard({ prompt, onAddAnswer, onDelete }: PromptCardProps) {
  const [showAnswerForm, setShowAnswerForm] = useState(false);
  const [answerContent, setAnswerContent] = useState("");
  const [answeredBy, setAnsweredBy] = useState("");
  const [showAnswers, setShowAnswers] = useState(false);

  const handleSubmitAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (answerContent.trim() && answeredBy.trim()) {
      onAddAnswer(prompt.id, answerContent.trim(), answeredBy.trim());
      setAnswerContent("");
      setAnsweredBy("");
      setShowAnswerForm(false);
      setShowAnswers(true);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-4">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
            {prompt.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            投稿者: {prompt.createdBy} | {new Date(prompt.createdAt).toLocaleString("ja-JP")}
          </p>
        </div>
        <button
          onClick={() => onDelete(prompt.id)}
          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 ml-4"
          title="削除"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setShowAnswerForm(!showAnswerForm)}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
        >
          {showAnswerForm ? "キャンセル" : "回答する"}
        </button>
        {prompt.answers.length > 0 && (
          <button
            onClick={() => setShowAnswers(!showAnswers)}
            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
          >
            {showAnswers ? "回答を隠す" : `回答を見る (${prompt.answers.length})`}
          </button>
        )}
      </div>

      {showAnswerForm && (
        <form onSubmit={handleSubmitAnswer} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
          <div className="mb-3">
            <label htmlFor={`answer-content-${prompt.id}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              あなたの回答
            </label>
            <textarea
              id={`answer-content-${prompt.id}`}
              value={answerContent}
              onChange={(e) => setAnswerContent(e.target.value)}
              placeholder="あなたの考えを書いてください..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
              rows={3}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor={`answer-by-${prompt.id}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              あなたの名前
            </label>
            <input
              type="text"
              id={`answer-by-${prompt.id}`}
              value={answeredBy}
              onChange={(e) => setAnsweredBy(e.target.value)}
              placeholder="例: 佐藤花子"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
          >
            回答を投稿
          </button>
        </form>
      )}

      {showAnswers && prompt.answers.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-3">回答一覧</h4>
          <div className="space-y-3">
            {prompt.answers.map((answer: Answer) => (
              <div key={answer.id} className="bg-white dark:bg-gray-600 rounded p-3">
                <p className="text-gray-800 dark:text-gray-100 mb-2">{answer.content}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {answer.answeredBy} | {new Date(answer.createdAt).toLocaleString("ja-JP")}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
