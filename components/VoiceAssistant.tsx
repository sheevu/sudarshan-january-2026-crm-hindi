
import React, { useState, useRef } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const VoiceAssistant: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState('Tap to Start Live Help');
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const nextStartTimeRef = useRef(0);

  const startSession = async () => {
    try {
      setStatus('Connecting...');
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = audioCtx;
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            setIsActive(true);
            setStatus('Munim Ji is Listening...');
          },
          onmessage: async (msg: LiveServerMessage) => {
            if (msg.serverContent?.outputTranscription) {
              console.log("AI:", msg.serverContent.outputTranscription.text);
            }
            if (msg.serverContent?.modelTurn?.parts[0]?.inlineData?.data) {
              const base64Audio = msg.serverContent.modelTurn.parts[0].inlineData.data;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, audioCtx.currentTime);
              
              const audioBuffer = await decodeAudioData(decode(base64Audio), audioCtx, 24000, 1);
              const sourceNode = audioCtx.createBufferSource();
              sourceNode.buffer = audioBuffer;
              sourceNode.connect(audioCtx.destination);
              sourceNode.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(sourceNode);
              sourceNode.onended = () => sourcesRef.current.delete(sourceNode);
            }
          },
          onclose: () => {
            setIsActive(false);
            setStatus('Session Closed');
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } } },
          systemInstruction: 'You are Munim Ji. Be helpful and talk in Hinglish.',
        }
      });
      
      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error(err);
      setStatus('Connection Failed');
    }
  };

  const stopSession = () => {
    if (sessionRef.current) sessionRef.current.close();
    setIsActive(false);
    setStatus('Tap to Start Live Help');
  };

  return (
    <div className="p-8 flex flex-col items-center justify-center min-h-[75vh] space-y-12 bg-white">
      {/* Microphone Visualizer Circle - Matching Screenshot */}
      <div className="relative group">
        <div className={`w-56 h-56 rounded-full flex items-center justify-center transition-all duration-700 ${isActive ? 'bg-indigo-500/20 scale-110 shadow-2xl' : 'bg-slate-100'}`}>
          <div className={`w-36 h-36 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl ${isActive ? 'bg-indigo-600' : 'bg-slate-900'}`}>
            <button 
              onClick={isActive ? stopSession : startSession}
              className="text-white text-5xl active:scale-90 transition-transform flex items-center justify-center"
            >
              <i className={`fas ${isActive ? 'fa-square-full text-2xl' : 'fa-microphone'}`}></i>
            </button>
          </div>
          {isActive && (
            <div className="absolute inset-0 rounded-full border-4 border-indigo-500/40 animate-ping"></div>
          )}
        </div>
      </div>
      
      <div className="text-center space-y-5 px-6">
        <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-none">{status}</h2>
        <p className="text-slate-500 text-base font-bold leading-relaxed italic opacity-80">
          "Bhaiya, aaj ki bikri kitni hui?" – Munim Ji se Live baat karein.
        </p>
      </div>

      <div className="w-full max-w-sm space-y-4">
        <div className="bg-white p-5 rounded-[2rem] border border-slate-100 flex items-center gap-5 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <i className="fab fa-whatsapp text-2xl"></i>
          </div>
          <div className="h-4 w-32 bg-slate-100 rounded-full animate-pulse"></div>
        </div>
        <div className="bg-white p-5 rounded-[2rem] border border-slate-100 flex items-center gap-5 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500">
            <i className="fas fa-sparkles text-2xl"></i>
          </div>
          <div className="h-4 w-44 bg-slate-100 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default VoiceAssistant;
