export interface Answer {
  id: string;
  promptId: string;
  content: string;
  answeredBy: string;
  createdAt: string;
}

export interface Prompt {
  id: string;
  title: string;
  createdBy: string;
  createdAt: string;
  answers: Answer[];
}
