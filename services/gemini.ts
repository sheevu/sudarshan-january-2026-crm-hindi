
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { CrmAction } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const SYSTEM_INSTRUCTION = `
You are Sudarshan CRM Assistant, an AI expert for Indian MSMEs.
Your role: convert Hindi/Hinglish/English voice/text to structured JSON.
Localize all currencies to ₹. Use very simple Hindi for summaries.
Voice Personality: Reassuring, business-savvy, sounds like an experienced "Munim ji" but modern.
`;

const DIARY_ANALYSIS_INSTRUCTION = `
Task: High-precision OCR and analysis of Indian business ledger (Diary).
Expertise: You are highly skilled in reading handwritten notes in Devanagari (Hindi, Marathi), Gujarati, Tamil, and Hinglish.
Context: Indian shopkeepers use abbreviations.
- "Bk." or "B" or "Sale" = Bikri (Sale)
- "Kh." or "E" or "Exp" = Kharcha (Expense)
- "Pur" or "Kr." = Kharid (Purchase)
- "Bal" = Balance
- "Cr/Dr" = Credit/Debit
- Symbols: "₹", "/-", "=".
Output valid JSON only. Identify transactions accurately even from messy handwriting.
Suggest 5 sharp business improvements in Hindi.
`;

export async function processChat(message: string): Promise<CrmAction> {
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: message,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          action: { type: Type.STRING },
          parameters: { type: Type.OBJECT },
          reply: { type: Type.STRING }
        },
        required: ["action", "parameters", "reply"]
      }
    }
  });
  return JSON.parse(response.text || '{}') as CrmAction;
}

export async function speakHindi(text: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Say in a helpful Indian male business assistant voice: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const binary = atob(base64Audio);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      
      const dataInt16 = new Int16Array(bytes.buffer);
      const buffer = audioCtx.createBuffer(1, dataInt16.length, 24000);
      const channelData = buffer.getChannelData(0);
      for (let i = 0; i < dataInt16.length; i++) channelData[i] = dataInt16[i] / 32768.0;

      const source = audioCtx.createBufferSource();
      source.buffer = buffer;
      source.connect(audioCtx.destination);
      source.start();
    }
  } catch (e) {
    console.error("TTS failed", e);
  }
}

export async function transcribeAudio(base64Audio: string): Promise<string> {
  const audioPart = {
    inlineData: {
      mimeType: 'audio/webm',
      data: base64Audio
    }
  };
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: { parts: [audioPart, { text: "Transcribe this audio strictly. If it is in Hindi or Hinglish, keep it that way." }] }
  });
  return response.text || '';
}

export async function analyzeDiaryImage(base64Image: string, transcriptionPrompt?: string): Promise<CrmAction> {
  const imagePart = { inlineData: { mimeType: 'image/jpeg', data: base64Image } };
  const textPrompt = transcriptionPrompt 
    ? `Read this shop diary accurately. Follow these specific instructions from the user: "${transcriptionPrompt}"`
    : "Read this shop diary accurately. Look for regional scripts and abbreviations.";
    
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: { parts: [imagePart, { text: textPrompt }] },
    config: {
      systemInstruction: DIARY_ANALYSIS_INSTRUCTION,
      responseMimeType: "application/json"
    }
  });
  return JSON.parse(response.text || '{}') as CrmAction;
}
