
export interface Message {
  id: string;
  role: 'user' | 'model' | 'system';
  text: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  lastUpdated: number;
}

export type View = 'chat' | 'diary' | 'prompt' | 'image' | 'video';

export interface Suggestion {
  title: string;
  description: string;
}

export interface DiaryEntry {
  id: string;
  date: string;
  emotion: string;
  summary: string;
  originalText: string;
}