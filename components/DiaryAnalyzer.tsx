
import React, { useState, useRef } from 'react';
import { analyzeDiaryImage, speakHindi } from '../services/gemini';
import { CrmAction, Transaction } from '../types';

const DiaryAnalyzer: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CrmAction | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const startAnalysis = async () => {
    if (!image) return;
    setLoading(true);
    try {
      const base64Data = image.split(',')[1];
      const analysisResult = await analyzeDiaryImage(base64Data);
      setResult(analysisResult);
      if (analysisResult.insights?.summary_hindi) {
        speakHindi(analysisResult.insights.summary_hindi);
      }
    } catch (error) {
      alert("Analysis failed. Handwriting clearly scan karein.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 space-y-6 pb-24 bg-white min-h-screen">
      <header className="flex justify-between items-center py-2">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Diary Scanner</h1>
          <p className="text-[10px] text-orange-600 font-black uppercase tracking-[0.2em]">Hisaab Automatic Extract</p>
        </div>
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 border border-orange-100 flex items-center justify-center shadow-sm"
        >
          <i className="fas fa-camera text-xl"></i>
        </button>
      </header>

      <input 
        type="file" 
        accept="image/*" 
        capture="environment"
        className="hidden" 
        ref={fileInputRef} 
        onChange={handleImageUpload}
      />

      {!image && (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-200 bg-slate-50/50 rounded-[3rem] p-12 text-center space-y-6 cursor-pointer group hover:bg-slate-50 transition-all"
        >
          <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto text-orange-500 shadow-md group-hover:scale-105 transition-transform">
            <i className="fas fa-file-pen text-3xl"></i>
          </div>
          <div className="space-y-1">
            <p className="font-black text-slate-900 text-lg">Hath Se Likha Hisaab</p>
            <p className="text-xs text-slate-500 font-bold px-4">
              Regional scripts (Hindi, Gujarati etc.) aur abbreviations support karta hai.
            </p>
          </div>
          <button className="bg-slate-900 text-white px-8 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl">
            Photo Khichein
          </button>
        </div>
      )}

      {image && !result && (
        <div className="space-y-6 animate-in fade-in duration-500">
          <div className="rounded-[2.5rem] overflow-hidden shadow-xl border-4 border-white relative">
            <img src={image} alt="Diary Preview" className="w-full h-auto object-cover" />
          </div>
          <div className="flex gap-3">
             <button 
              onClick={() => setImage(null)}
              className="flex-1 py-4 rounded-2xl bg-slate-100 text-slate-600 font-black text-[10px] uppercase tracking-widest"
             >
               Retake
             </button>
             <button 
              onClick={startAnalysis}
              disabled={loading}
              className="flex-[2] py-4 rounded-2xl bg-orange-500 text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-orange-500/20"
            >
              {loading ? <i className="fas fa-spinner fa-spin mr-2"></i> : <i className="fas fa-wand-magic-sparkles mr-2"></i>}
              {loading ? 'Hisaab Nikal Rahe Hain...' : 'Analysis Start Karein'}
            </button>
          </div>
        </div>
      )}

      {result && (
        <div className="space-y-6 animate-in slide-in-from-bottom-8">
           <div className="glass-card p-6 rounded-[2.5rem] space-y-4">
              <p className="text-sm font-bold text-slate-800 leading-relaxed bg-slate-50 p-4 rounded-2xl border-l-4 border-orange-500 italic">
                "{result.insights?.summary_hindi || result.reply}"
              </p>
              <div className="grid grid-cols-2 gap-3">
                 <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                    <p className="text-[9px] font-black text-emerald-600 uppercase mb-1">Total Sale</p>
                    <p className="text-xl font-black text-slate-900">₹{result.parameters.total_sale}</p>
                 </div>
                 <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                    <p className="text-[9px] font-black text-blue-600 uppercase mb-1">Hisaab Net</p>
                    <p className="text-xl font-black text-slate-900">₹{result.parameters.profit_loss}</p>
                 </div>
              </div>
           </div>
           <button 
             onClick={() => {setImage(null); setResult(null)}}
             className="w-full py-4 text-[10px] font-black uppercase text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl"
           >
             Naya Page Scan Karein
           </button>
        </div>
      )}
    </div>
  );
};

export default DiaryAnalyzer;
