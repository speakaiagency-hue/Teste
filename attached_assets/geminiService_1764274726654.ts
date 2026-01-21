import { GoogleGenAI } from "@google/genai";

// Inicializa o cliente com a variável de ambiente do Vite
const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_AI_STUDIO_API_KEY,
});

export const generateCreativePrompt = async (userText: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    config: {
      systemInstruction:
        "Você é um especialista em engenharia de prompts de IA, focado em criar descrições visuais para modelos de geração de imagem de alta qualidade (como Imagen, Midjourney, DALL-E). Seu objetivo é pegar descrições simples do usuário e expandi-las em prompts altamente detalhados, artísticos e descritivos. Foque em iluminação, textura, composição, atmosfera, estilo artístico e configurações de câmera. Escreva o resultado final inteiramente em PORTUGUÊS. A saída deve ser APENAS o texto do prompt, sem markdown, sem explicações adicionais.",
    },
    contents: `Melhore e expanda esta descrição para um prompt completo de geração de imagem: "${userText}".\n\nGaranta que o prompt seja rico em detalhes visuais e esteja em português.`,
  });

  return response.text || "Não foi possível gerar o prompt.";
};

export { ai };
