
import React, { useState, useRef, useEffect } from 'react';
import { analyzeDiaryImage, generateSpeech, transcribeAudio } from '../services/gemini';
import { CrmAction } from '../types';
import { Mic, Square, Camera, FileText, Trash2, Download, CheckCircle2, TrendingUp, Wallet, PlusCircle, XCircle, Volume2, Loader2 } from 'lucide-react';

const DiaryAnalyzer: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [result, setResult] = useState<CrmAction | null>(null);
  const [transcription, setTranscription] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Automatic Analysis Trigger: Trigger whenever an image is uploaded
  // Or whenever transcription changes while an image is already present
  useEffect(() => {
    if (image && !result && !loading) {
      const timeoutId = setTimeout(() => {
        triggerAnalysis(transcription);
      }, 500); // Small debounce for manual typing
      return () => clearTimeout(timeoutId);
    }
  }, [image, transcription]);

  // Automatic Report offering side-effect
  useEffect(() => {
    if (result && !loading) {
      // Prompt user that report is ready
      generateSpeech("Hisaab teyar hai. Aap report download kar sakte hain.");
    }
  }, [result]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerAnalysis = async (customPrompt: string) => {
    if (!image || loading) return;
    setLoading(true);
    try {
      const base64Data = image.split(',')[1];
      const analysisResult = await analyzeDiaryImage(base64Data, customPrompt);
      setResult(analysisResult);
    } catch (error) {
      console.error("Analysis failed", error);
      alert("Analysis fail ho gayi. Kripya photo saaf khichein.");
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = () => {
    if (!result) return;
    const reportText = `
SUDARSHAN AI - DIARY ANALYSIS REPORT
------------------------------------
Date: ${new Date().toLocaleDateString('en-IN')}
Instruction: ${transcription || 'Auto-Scan'}

SUMMARY (HINDI):
${result.insights?.summary_hindi || result.reply}

KEY METRICS:
- Total Sale Recorded: ₹${result.parameters?.total_sale || '0'}
- Net Profit/Loss: ₹${result.parameters?.profit_loss || '0'}

ACTION STEPS FOR GROWTH:
${result.insights?.action_steps_hindi?.map((s, i) => `${i + 1}. ${s}`).join('\n') || 'N/A'}

------------------------------------
Sudarshan AI Labs - Strengthening MSMEs
    `;
    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Hisaab_Report_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64Audio = (reader.result as string).split(',')[1];
          setLoading(true);
          try {
            const text = await transcribeAudio(base64Audio);
            setTranscription(text);
            // If image exists, the useEffect will trigger analysis automatically
            if (!image) {
              generateSpeech("Instruction samajh liye hain. Ab diary ki photo scan karein.");
              fileInputRef.current?.click();
            }
          } catch (e) {
            console.error("Transcription failed", e);
          } finally {
            setLoading(false);
          }
        };
        reader.readAsDataURL(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Mic access error", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleListenSummary = async () => {
    if (!result || isSpeaking) return;
    setIsSpeaking(true);
    const summary = result.insights?.summary_hindi || result.reply;
    const steps = result.insights?.action_steps_hindi?.join('. ') || '';
    await generateSpeech(`${summary}. Agle kadam: ${steps}`);
    setIsSpeaking(false);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 sm:space-y-10 pb-32 bg-white min-h-screen">
      <header className="flex justify-between items-start pt-2 sm:pt-4 border-b border-slate-100 pb-4 sm:pb-6">
        <div className="space-y-1">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tighter">Diary Analyzer</h1>
          <p className="text-[10px] sm:text-xs text-orange-600 font-black uppercase tracking-[0.2em]">Automated Accounting</p>
        </div>
        <div className="flex gap-2 sm:gap-4">
          <button 
            onClick={isRecording ? stopRecording : startRecording}
            className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl sm:rounded-[1.5rem] flex items-center justify-center shadow-xl transition-all ${
              isRecording ? 'bg-red-600 text-white animate-pulse' : 'bg-slate-900 text-white hover:bg-indigo-600'
            }`}
          >
            {isRecording ? <Square size={20} /> : <Mic size={20} />}
          </button>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl sm:rounded-[1.5rem] bg-indigo-600 text-white flex items-center justify-center shadow-xl active:scale-95 transition-transform"
          >
            <Camera size={20} />
          </button>
        </div>
      </header>

      <input 
        type="file" 
        accept="image/*" 
        capture="environment"
        className="hidden" 
        ref={fileInputRef} 
        onChange={handleImageUpload}
      />

      {/* Manual Instruction Text Field */}
      <div className="space-y-2 sm:space-y-3">
        <label className="text-[10px] sm:text-[11px] font-black text-slate-500 uppercase ml-4 tracking-[0.3em]">Hisaab Details (Manual Input)</label>
        <div className="relative group">
          <textarea 
            className="w-full bg-slate-50 border-2 sm:border-4 border-slate-100 rounded-[2rem] sm:rounded-[2.5rem] px-6 sm:px-8 py-5 sm:py-7 text-base sm:text-lg font-black text-slate-900 focus:outline-none focus:border-indigo-400 transition-all placeholder:text-slate-300 shadow-inner min-h-[100px] sm:min-h-[120px] resize-none"
            placeholder="Kuch specific puchiye ya notes likhein..."
            value={transcription}
            onChange={(e) => setTranscription(e.target.value)}
          />
          {transcription && (
            <button 
              onClick={() => setTranscription('')}
              className="absolute right-5 top-5 w-8 h-8 flex items-center justify-center text-slate-400 hover:text-rose-500"
            >
              <XCircle size={20} />
            </button>
          )}
        </div>
      </div>

      {!image && !loading && (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="border-2 sm:border-4 border-dashed border-slate-200 bg-slate-50/50 rounded-[2.5rem] sm:rounded-[4rem] p-8 sm:p-16 text-center space-y-6 sm:space-y-8 cursor-pointer group hover:bg-white hover:border-indigo-200 transition-all shadow-inner"
        >
          <div className="w-20 h-20 sm:w-28 sm:h-28 bg-white rounded-2xl sm:rounded-[2rem] flex items-center justify-center mx-auto text-indigo-600 shadow-xl group-hover:scale-105 transition-transform border border-slate-100">
            <FileText size={32} className="sm:hidden" />
            <FileText size={48} className="hidden sm:block" />
          </div>
          <div className="space-y-2 sm:space-y-4">
            <h2 className="font-black text-slate-900 text-xl sm:text-2xl tracking-tight leading-none">Photo Scan Karein</h2>
            <p className="text-sm sm:text-base text-slate-600 font-bold leading-relaxed px-2 sm:px-4">
              Dukan ki diary ki saaf photo khichein. AI automatic hisaab calculate karega.
            </p>
          </div>
        </div>
      )}

      {image && !result && !loading && (
        <div className="space-y-8 animate-in fade-in duration-500">
          <div className="rounded-[4rem] overflow-hidden shadow-2xl border-[10px] border-white relative group">
            <img src={image} alt="Diary Preview" className="w-full h-auto object-cover max-h-[400px]" />
            <div className="absolute top-6 right-6">
              <button 
                onClick={() => {setImage(null); setResult(null); setTranscription('');}}
                className="w-12 h-12 bg-white/95 backdrop-blur rounded-2xl flex items-center justify-center text-rose-600 shadow-lg border-2 border-slate-100"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
          <div className="flex flex-col items-center gap-4 py-4">
             <div className="flex items-center gap-3 bg-indigo-50 px-6 py-4 rounded-[2rem] border-2 border-indigo-100">
                <span className="w-4 h-4 bg-indigo-600 rounded-full animate-ping"></span>
                <span className="text-base font-black text-indigo-900 uppercase tracking-widest">Munim Ji Reading Records...</span>
             </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-32 space-y-12">
          <div className="relative">
            <div className="w-32 h-32 border-[12px] border-slate-100 rounded-full"></div>
            <div className="w-32 h-32 border-[12px] border-indigo-600 border-t-transparent rounded-full animate-spin absolute top-0"></div>
          </div>
          <div className="text-center space-y-4">
            <p className="font-black text-slate-900 text-4xl uppercase tracking-tighter">AI Analysis Active</p>
            <p className="text-lg text-slate-500 font-black uppercase tracking-widest opacity-80">Reading Hand-written Notes...</p>
          </div>
        </div>
      )}

      {result && !loading && (
        <div className="space-y-8 sm:space-y-10 animate-in slide-in-from-bottom-20">
           {/* Automatic Report Card offered immediately */}
           <div className="bg-slate-900 p-6 sm:p-8 rounded-[2rem] sm:rounded-[3rem] border border-slate-800 shadow-2xl relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 p-16 opacity-10 pointer-events-none transition-transform group-hover:rotate-12">
                <Download size={120} className="text-white" />
              </div>
              <div className="relative z-10 space-y-4 sm:space-y-5">
                <div className="flex items-center gap-3 sm:gap-4">
                   <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-md rounded-xl sm:rounded-2xl flex items-center justify-center text-white border border-white/30">
                     <CheckCircle2 size={20} />
                   </div>
                   <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">Report Taiyar Hai!</h3>
                </div>
                <p className="text-xs sm:text-sm font-bold text-slate-300 leading-relaxed max-w-[280px]">
                  Analysis safal rahi. Aapka digital business report download ke liye ready hai.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button 
                    onClick={downloadReport}
                    className="bg-white text-slate-900 px-6 sm:px-10 py-4 sm:py-5 rounded-xl sm:rounded-[1.5rem] font-black uppercase text-[10px] sm:text-xs tracking-[0.2em] shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3"
                  >
                    <Download size={16} /> Download Report
                  </button>
                  <button 
                    onClick={handleListenSummary}
                    disabled={isSpeaking}
                    className="bg-indigo-600 text-white px-6 sm:px-10 py-4 sm:py-5 rounded-xl sm:rounded-[1.5rem] font-black uppercase text-[10px] sm:text-xs tracking-[0.2em] shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {isSpeaking ? <Loader2 size={16} className="animate-spin" /> : <Volume2 size={16} />}
                    Listen in Hindi
                  </button>
                </div>
              </div>
           </div>

           <div className="bg-white p-6 sm:p-10 rounded-[2.5rem] sm:rounded-[4rem] space-y-8 sm:space-y-10 border-2 sm:border-4 border-slate-50 shadow-2xl relative">
              <div className="space-y-4 sm:space-y-6">
                <p className="text-[10px] sm:text-xs font-black text-orange-600 uppercase tracking-[0.3em] px-2">Analysis Results</p>
                <div className="bg-slate-50 p-6 sm:p-10 rounded-[2rem] sm:rounded-[3.5rem] border-2 border-slate-100 shadow-inner">
                   <p className="text-lg sm:text-2xl font-black text-slate-900 leading-snug italic">
                    "{result.insights?.summary_hindi || result.reply}"
                   </p>
                </div>
              </div>

              {/* Transactions Table */}
              {result.parameters?.transactions && (
                <div className="space-y-4 sm:space-y-6">
                  <h4 className="text-[10px] sm:text-xs font-black text-slate-500 uppercase tracking-[0.4em] px-4">Extracted Transactions</h4>
                  <div className="overflow-x-auto rounded-2xl sm:rounded-[2.5rem] border-2 border-slate-100">
                    <table className="w-full text-left border-collapse min-w-[300px]">
                      <thead>
                        <tr className="bg-slate-50 border-b-2 border-slate-100">
                          <th className="p-3 sm:p-5 text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</th>
                          <th className="p-3 sm:p-5 text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">Label</th>
                          <th className="p-3 sm:p-5 text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.parameters.transactions.map((t: any, i: number) => (
                          <tr key={i} className="border-b border-slate-50 last:border-none hover:bg-slate-50/50 transition-colors">
                            <td className="p-3 sm:p-5">
                              <span className={`text-[8px] sm:text-[10px] font-black px-2 sm:px-3 py-1 rounded-full uppercase tracking-widest ${
                                t.type === 'SALE' ? 'bg-emerald-100 text-emerald-700' : 
                                t.type === 'PURCHASE' ? 'bg-blue-100 text-blue-700' : 'bg-rose-100 text-rose-700'
                              }`}>
                                {t.type}
                              </span>
                            </td>
                            <td className="p-3 sm:p-5 text-xs sm:text-sm font-bold text-slate-700">{t.label}</td>
                            <td className="p-3 sm:p-5 text-xs sm:text-sm font-black text-slate-900 text-right">₹{t.amount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 sm:gap-8">
                 <div className="bg-emerald-50 p-6 sm:p-10 rounded-2xl sm:rounded-[3rem] border-2 border-emerald-100 shadow-sm transition-transform hover:scale-[1.02]">
                    <p className="text-[9px] sm:text-xs font-black text-emerald-800 uppercase tracking-widest mb-2 sm:mb-3 flex items-center gap-2">
                      <TrendingUp size={12} /> Sale
                    </p>
                    <p className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tighter">₹{result.parameters?.total_sale || '0'}</p>
                 </div>
                 <div className="bg-blue-50 p-6 sm:p-10 rounded-2xl sm:rounded-[3rem] border-2 border-blue-100 shadow-sm transition-transform hover:scale-[1.02]">
                    <p className="text-[9px] sm:text-xs font-black text-blue-800 uppercase tracking-widest mb-2 sm:mb-3 flex items-center gap-2">
                      <Wallet size={12} /> Net
                    </p>
                    <p className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tighter">₹{result.parameters?.profit_loss || '0'}</p>
                 </div>
              </div>

              {result.insights?.action_steps_hindi && (
                <div className="space-y-6 sm:space-y-8">
                  <h4 className="text-[10px] sm:text-xs font-black text-slate-500 uppercase tracking-[0.4em] px-4">Vyapar Vridhi Tips</h4>
                  <div className="space-y-3 sm:space-y-5">
                    {result.insights.action_steps_hindi.map((step, idx) => (
                      <div key={idx} className="flex gap-4 sm:gap-6 items-center bg-white p-5 sm:p-8 rounded-2xl sm:rounded-[2.5rem] border-2 border-slate-50 shadow-sm hover:border-indigo-200 transition-all active:scale-[0.98]">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-600 text-white rounded-xl sm:rounded-2xl flex items-center justify-center text-base sm:text-lg font-black shrink-0 shadow-lg">
                          {idx + 1}
                        </div>
                        <p className="text-base sm:text-xl font-bold text-slate-800 leading-tight">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
           </div>
           
           <button 
             onClick={() => {setImage(null); setResult(null); setTranscription('');}}
             className="w-full py-6 sm:py-8 text-xs sm:text-sm font-black uppercase text-slate-400 border-2 sm:border-4 border-dashed border-slate-200 rounded-[2rem] sm:rounded-[4rem] hover:text-indigo-600 hover:border-indigo-200 transition-all flex items-center justify-center gap-3 sm:gap-4 bg-slate-50/20"
           >
             <PlusCircle size={20} /> Scan Naya Diary Page
           </button>
        </div>
      )}
    </div>
  );
};

export default DiaryAnalyzer;
