// Tipagem de proporções padronizada
export type AspectRatio = "1:1" | "3:4" | "4:3" | "9:16" | "16:9";

// Imagem de referência usada como input para geração
export interface ReferenceImage {
  id: string;
  data: string; // base64 puro
  mimeType: string;
  preview: string; // usado para exibir no front
}

// Imagem gerada pela IA
export interface GeneratedImage {
  id: string;
  url: string; // base64 data url
  prompt: string;
  aspectRatio: AspectRatio; // agora tipado corretamente
  timestamp: number;
  width?: number;
  height?: number;
}

// Configuração de geração
export interface GenerationConfig {
  prompt: string;
  negativePrompt?: string;
  aspectRatio: AspectRatio;
  numberOfImages: number;
}

// Metadados de projeto
export interface Project {
  id: string;
  title: string;
  imageUrl: string;
  videoUrl?: string;
  messagesCount?: number;
  isGenerated?: boolean;
  description?: string;
  tag?: string;
}

export type AppView = "home";
