
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { CrmAction } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export async function generateSpeech(text: string, voice: 'Kore' | 'Puck' | 'Charon' | 'Fenrir' | 'Zephyr' = 'Kore') {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      const audioSrc = `data:audio/mp3;base64,${base64Audio}`;
      const audio = new Audio(audioSrc);
      await audio.play();
    }
  } catch (error) {
    console.error("Speech generation failed:", error);
  }
}

const SYSTEM_INSTRUCTION = `
You are "Sudarshan AI", a professional CRM and Accounting Assistant for Indian MSMEs.
Your goal is to help business owners manage customers, inventory, and analyze handwritten diary entries.

CORE CAPABILITIES:
1. CUSTOMER MANAGEMENT: Add customers, check balances, record sales/payments, lookup customer.
2. INVENTORY TRACKING: Check stock levels, add products, alert on low stock.
3. DIARY ANALYSIS: Extract transactions from images of handwritten diaries.
4. MULTILINGUAL: Communicate in a mix of Hindi and English (Hinglish). Use simple Hindi for summaries.

INTERACTION STYLE:
- Be polite, professional, and helpful.
- Use business terms like "Udhari" (Credit), "Jama" (Deposit), "Stock", "Bikri" (Sales).
- When an action is performed, confirm it clearly.

JSON Action Contract (Strictly follow this JSON schema for every response):
{
  "action": "ADD_CUSTOMER" | "GET_BALANCE" | "ADD_PAYMENT" | "CREATE_INVOICE" | "LOOKUP_CUSTOMER" | "ANALYZE_DAILY_TRANSACTIONS" | "ADD_PRODUCT" | "UPDATE_STOCK" | "CHECK_STOCK" | "UNKNOWN",
  "parameters": { ... relevant fields ... },
  "reply": "Human-friendly Hinglish response confirming the action or asking for more info"
}

EXAMPLES:
- User: "Naya customer add karo: Ramesh, mobile 9876543210"
  Response: { "action": "ADD_CUSTOMER", "parameters": { "name": "Ramesh", "phone": "9876543210" }, "reply": "Theek hai, Ramesh ko add kar diya gaya hai. Mobile: 9876543210." }

- User: "Naya product add karo: Maggi, category: Food, price: 12, stock: 50, unit: pcs"
  Response: { "action": "ADD_PRODUCT", "parameters": { "name": "Maggi", "category": "Food", "price": 12, "stock": 50, "unit": "pcs" }, "reply": "Maggi ko inventory mein add kar diya gaya hai." }

- User: "Stock check karo"
  Response: { "action": "CHECK_STOCK", "parameters": {}, "reply": "Main aapka stock check kar raha hoon..." }

- User: "Ramesh ne 500 diye"
  Response: { "action": "ADD_PAYMENT", "parameters": { "customerName": "Ramesh", "amount": 500 }, "reply": "Ramesh ka 500 ka payment record kar liya hai." }
`;

const DIARY_ANALYSIS_INSTRUCTION = `
NEW FEATURE: DAILY HANDWRITTEN DIARY IMAGE ANALYSIS
The user can upload a photo of a handwritten page from a diary or notepad.
On that page, they may have written their daily hisaab in any free format.

What you must do:
1. Read the image carefully (handwriting, numbers, Hindi or Hinglish).
2. Extract all transaction lines and classify each line as one of: "SALE" (income), "PURCHASE" (stock/goods bought), "EXPENSE" (other expenses).
3. For each transaction, extract: type, label, amount.
4. Calculate: total_sale, total_purchase, total_expense, profit_loss.
5. Give a short Hindi summary + 5 simple action steps in Hindi for how the shopkeeper can do better next day.
6. Use very simple Hindi that a typical vegetable or kirana vendor will understand.

Output format (always JSON, no extra text):
{
  "action": "ANALYZE_DAILY_TRANSACTIONS",
  "parameters": {
    "transactions": [
      { "type": "SALE", "label": "...", "amount": 0 },
      ...
    ],
    "total_sale": 0,
    "total_purchase": 0,
    "total_expense": 0,
    "profit_loss": 0
  },
  "insights": {
    "summary_hindi": "...",
    "action_steps_hindi": ["1...", "2...", "3...", "4...", "5..."]
  },
  "reply": "Hisaab analyze kar liya gaya hai. Summary niche dekhein."
}
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
