import { GoogleGenAI, Chat, GenerateContentResponse, Content, LiveSession, LiveServerMessage, Modality } from "@google/genai";
import { decode, decodeAudioData } from '../utils/audio';

let ai: GoogleGenAI;
let outputAudioContext: AudioContext | null;
let nextStartTime = 0;
const sources = new Set<AudioBufferSourceNode>();

// Alteração: usa variável de ambiente definida no Render
const getAI = () => {
    if (!ai) {
        const apiKey = import.meta.env.VITE_AI_STUDIO_API_KEY;
        if (!apiKey) {
            throw new Error("VITE_AI_STUDIO_API_KEY environment variable not set");
        }
        ai = new GoogleGenAI({ apiKey });
    }
    return ai;
}

export interface LiveSessionCallbacks {
    onInputTranscription: (text: string) => void;
    onOutputTranscription: (text: string) => void;
    onTurnComplete: (fullInput: string, fullOutput: string) => void;
    onError: (error: ErrorEvent) => void;
    onClose: (event: CloseEvent) => void;
}

export const startLiveSession = async (callbacks: LiveSessionCallbacks): Promise<LiveSession> => {
    const ai = getAI();
    let currentInputTranscription = '';
    let currentOutputTranscription = '';

    if (!outputAudioContext || outputAudioContext.state === 'closed') {
        outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        nextStartTime = 0;
        sources.clear();
    }

    const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
            onopen: () => {
                console.log('Live session opened.');
            },
            onmessage: async (message: LiveServerMessage) => {
                if (message.serverContent?.outputTranscription) {
                    const text = message.serverContent.outputTranscription.text;
                    currentOutputTranscription += text;
                    callbacks.onOutputTranscription(currentOutputTranscription);
                } else if (message.serverContent?.inputTranscription) {
                    const text = message.serverContent.inputTranscription.text;
                    currentInputTranscription += text;
                    callbacks.onInputTranscription(currentInputTranscription);
                }

                if (message.serverContent?.turnComplete) {
                    const finalInput = currentInputTranscription;
                    const finalOutput = currentOutputTranscription;
                    currentInputTranscription = '';
                    currentOutputTranscription = '';
                    callbacks.onTurnComplete(finalInput, finalOutput);
                }

                const base64EncodedAudioString = message.serverContent?.modelTurn?.parts[0]?.inlineData.data;
                if (base64EncodedAudioString && outputAudioContext) {
                    nextStartTime = Math.max(nextStartTime, outputAudioContext.currentTime);
                    const audioBuffer = await decodeAudioData(
                        decode(base64EncodedAudioString),
                        outputAudioContext,
                        24000,
                        1
                    );
                    const source = outputAudioContext.createBufferSource();
                    source.buffer = audioBuffer;
                    source.connect(outputAudioContext.destination);
                    source.addEventListener('ended', () => {
                        sources.delete(source);
                    });
                    source.start(nextStartTime);
                    nextStartTime += audioBuffer.duration;
                    sources.add(source);
                }

                const interrupted = message.serverContent?.interrupted;
                if (interrupted) {
                    for (const source of sources.values()) {
                        source.stop();
                        sources.delete(source);
                    }
                    nextStartTime = 0;
                }
            },
            onerror: (e: ErrorEvent) => {
                console.error("Live session error:", e);
                callbacks.onError(e);
            },
            onclose: (e: CloseEvent) => {
                console.log('Live session closed.');
                callbacks.onClose(e);
                for (const source of sources.values()) {
                    source.stop();
                    sources.delete(source);
                }
                if (outputAudioContext && outputAudioContext.state !== 'closed') {
                    outputAudioContext.close().then(() => outputAudioContext = null);
                }
            },
        },
        config: {
            responseModalities: [Modality.AUDIO],
            outputAudioTranscription: {},
            inputAudioTranscription: {},
            systemInstruction: "Você é Speak AI, um assistente de autoajuda compassivo e empático. Seu objetivo é fornecer um espaço seguro e sem julgamentos para que os usuários expressem seus sentimentos. Ouça com atenção, responda com cordialidade e compreensão e guie-os suavemente em direção ao autoconhecimento e bem-estar. Não dê conselhos médicos. Mantenha as respostas concisas sempre que possível.",
        }
    });

    return sessionPromise;
};

export const createChat = (history?: Content[]): Chat => {
    const ai = getAI();
    return ai.chats.create({
        model: 'gemini-2.5-flash',
        history,
        config: {
            systemInstruction: "Você é Speak AI, um assistente de autoajuda compassivo e empático. Seu objetivo é fornecer um espaço seguro e sem julgamentos para que os usuários expressem seus sentimentos. Ouça com atenção, responda com cordialidade e compreensão e guie-os suavemente em direção ao autoconhecimento e bem-estar. Não dê conselhos médicos. Mantenha as respostas concisas sempre que possível."
        },
    });
};

export const sendMessage = async (chat: Chat, message: string): Promise<GenerateContentResponse> => {
    const result = await chat.sendMessage({ message });
    return result;
};

export const generateTitle = async (text: string): Promise<string> => {
    const ai = getAI();
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Analise a primeira mensagem de uma conversa e crie um título curto e temático (máximo 4 palavras). Mensagem do usuário: "${text}". Responda apenas com o título, sem nenhuma outra formatação ou texto.`,
        });
        return response.text.trim().replace(/"/g, '');
    } catch (error) {
        console.error("Failed to generate title:", error);
        return text.split(' ').slice(0, 5).join(' ');
    }
};
