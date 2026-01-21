import React, { useEffect, useState } from "react";
import {
  Image as ImageIcon,
  Download,
  RefreshCw,
  UploadCloud,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { getAuthHeader } from "@/lib/auth";
import { withMembershipCheck } from "@/components/ProtectedGenerator";
import { ReferenceImage } from "@/types";

const IMAGE_COST = 7;

function ImagePageComponent() {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [referenceImages, setReferenceImages] = useState<ReferenceImage[]>([]);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  const filesToBase64 = (files: FileList): Promise<ReferenceImage[]> =>
    Promise.all(
      Array.from(files).slice(0, 3).map(async (f) => {
        const reader = new FileReader();
        return new Promise<ReferenceImage>((resolve, reject) => {
          reader.onload = () => {
            const dataUrl = reader.result as string;
            resolve({
              id: Date.now().toString() + f.name,
              data: dataUrl.split(",")[1],
              mimeType: f.type,
              preview: dataUrl
            });
          };
          reader.onerror = reject;
          reader.readAsDataURL(f);
        });
      })
    );

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      try {
        const refs = await filesToBase64(e.target.files);
        setReferenceImages(refs);
        setGeneratedImages([]);
      } catch (err) {
        toast({ title: "Erro ao processar imagens", variant: "destructive" });
      }
    }
  };

  const handleGenerate = async () => {
    if (!prompt && referenceImages.length === 0) {
      toast({ title: "Digite um prompt ou envie imagens", variant: "destructive" });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch("/api/image/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeader() },
        body: JSON.stringify({ prompt, aspectRatio, referenceImages }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Erro ao gerar imagem");
      }

      if (Array.isArray(result.images)) {
        setGeneratedImages(result.images);
      } else if (result.imageUrl) {
        setGeneratedImages([result.imageUrl]);
      } else if (result.url) {
        setGeneratedImages([result.url]);
      } else {
        throw new Error("Resposta da API não contém URL da imagem.");
      }

      toast({ title: "Imagem processada com sucesso!" });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Ocorreu um erro inesperado.";
      toast({ title: errorMessage, variant: "destructive" });
      console.error("Image generation error:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col items-center text-center gap-2 mb-8">
        <h1 className="text-3xl font-heading font-bold flex items-center gap-2">
          <span className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
            <ImageIcon className="w-6 h-6" />
          </span>
          Geração de Imagem
        </h1>
        <p className="text-muted-foreground">
          Descreva o que você quer ver ou envie até 3 imagens de referência.
        </p>
      </div>

      {/* Prompt + Aspect ratio */}
      {/* ... mantém igual ao seu código atual ... */}

      {/* Upload múltiplo */}
      <div className="bg-[#0f1117] p-4 rounded-xl border border-dashed border-[#2d3748] shadow-2xl">
        <label htmlFor="file-upload" className="flex flex-col items-center justify-center gap-2 cursor-pointer py-10 rounded-xl transition hover:bg-[#1a1d24]">
          <UploadCloud className="w-10 h-10 text-purple-500" />
          <span className="text-sm text-gray-400">Clique para enviar até 3 imagens</span>
        </label>
        <input id="file-upload" type="file" accept="image/*" multiple onChange={onFileChange} className="hidden" />
        {referenceImages.length > 0 && (
          <div className="mt-4 grid grid-cols-3 gap-4">
            {referenceImages.map((img) => (
              <div key={img.id} className="relative">
                <img src={img.preview} alt="Preview" className="max-h-64 rounded-lg border border-gray-700 object-contain" />
                <button onClick={() => setReferenceImages(prev => prev.filter(r => r.id !== img.id))}
                  className="absolute top-2 right-2 bg-red-500/70 text-white rounded-full p-1">X</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Botão de ação */}
      {/* ... mantém igual ao seu código atual ... */}

      {/* Gallery + downloads */}
      {/* ... mantém igual ao seu código atual ... */}

      {/* Modal fullscreen */}
      {/* ... mantém igual ao seu código atual ... */}
    </div>
  );
}

export default withMembershipCheck(ImagePageComponent);
