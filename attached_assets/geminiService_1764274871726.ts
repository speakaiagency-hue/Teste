import { GoogleGenAI } from "@google/genai";

export async function generateImage(prompt: string, aspectRatio: string = '1:1'): Promise<{ imageUrl: string, model: string }> {
  const ai = new GoogleGenAI({ apiKey: process.env.VITE_AI_STUDIO_API_KEY! });

  try {
    const geminiResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio,
        },
      },
    });

    for (const part of geminiResponse.candidates[0].content.parts) {
      if (part.inlineData) {
        const base64EncodeString: string = part.inlineData.data;
        const mimeType = part.inlineData.mimeType;
        return {
          imageUrl: `data:${mimeType};base64,${base64EncodeString}`,
          model: 'Gemini Flash'
        };
      }
    }

    throw new Error("A resposta da API não continha uma imagem.");

  } catch(e) {
    console.error("Falha ao usar gemini-2.5-flash-image.", e);
    if (e instanceof Error) {
        let msg = e.message;
        if (msg.includes('401')) {
            msg = "Falha na autenticação (Erro 401)...";
        } else if (msg.includes('403')) {
            msg = "Acesso negado (Erro 403)...";
        } else if (msg.includes('429')) {
            msg = "Limite de uso excedido (Erro 429)...";
        }
        throw new Error(`Falha ao gerar imagem: ${msg}`);
    }
    throw new Error("Nenhuma imagem foi gerada.");
  }
}
