import { Prompt } from './types';

const STORAGE_KEY = 'prompt-box-data';

export const storage = {
  getPrompts: (): Prompt[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  savePrompts: (prompts: Prompt[]): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prompts));
  },

  addPrompt: (prompt: Prompt): void => {
    const prompts = storage.getPrompts();
    prompts.unshift(prompt);
    storage.savePrompts(prompts);
  },

  updatePrompt: (promptId: string, updatedPrompt: Prompt): void => {
    const prompts = storage.getPrompts();
    const index = prompts.findIndex(p => p.id === promptId);
    if (index !== -1) {
      prompts[index] = updatedPrompt;
      storage.savePrompts(prompts);
    }
  },

  deletePrompt: (promptId: string): void => {
    const prompts = storage.getPrompts();
    const filtered = prompts.filter(p => p.id !== promptId);
    storage.savePrompts(filtered);
  },
};
