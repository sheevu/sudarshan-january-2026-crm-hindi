
import React, { useState, useRef } from 'react';
import { Lead, LeadStatus } from '../types';

interface KanbanBoardProps {
  language: 'en' | 'hi';
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ language }) => {
  const [leads, setLeads] = useState<Lead[]>([
    { id: '1', name: 'Ramesh Halwai', detail: 'Party order for Sunday sweets', amount: '₹15,000', status: 'NAYA', assignedTo: 'SELF' },
    { id: '2', name: 'Suresh Tailor', detail: 'Bulk thread stock order', amount: '₹2,000', status: 'BAAT_CHAL_RAHI', reminderDate: '2023-11-20', assignedTo: 'RAVI' },
    { id: '3', name: 'Anita Boutique', detail: 'Wedding Season Sarees Bulk', amount: '₹55,000', status: 'PAKKA', assignedTo: 'MEENA' },
  ]);

  const scrollRef = useRef<HTMLDivElement>(null);

  const moveLead = (id: string, newStatus: LeadStatus) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const columns: { id: LeadStatus, en: string, hi: string, color: string, border: string }[] = [
    { id: 'NAYA', en: 'New Leads', hi: 'नए लोग', color: 'text-orange-500', border: 'border-orange-500' },
    { id: 'BAAT_CHAL_RAHI', en: 'In Progress', hi: 'बात चल रही है', color: 'text-blue-500', border: 'border-blue-500' },
    { id: 'PAKKA', en: 'Deal Won', hi: 'डील पक्की', color: 'text-emerald-500', border: 'border-emerald-500' }
  ];

  return (
    <div className="p-0 space-y-4 bg-white min-h-screen relative">
      <header className="flex justify-between items-center px-6 pt-8 pb-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none">
            {language === 'hi' ? 'काम की लिस्ट' : 'Task List'}
          </h1>
          <p className="text-xs text-indigo-700 font-bold uppercase tracking-[0.2em] mt-2">
            {language === 'hi' ? 'लीड्स और टास्क मैनेजमेंट' : 'Leads & Tasks Management'}
          </p>
        </div>
        <button className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-xl shadow-indigo-100 active:scale-95 transition-transform">
          <i className="fas fa-plus text-xl"></i>
        </button>
      </header>

      {/* Navigation Arrows for Sliding */}
      <div className="absolute top-[200px] left-2 z-10 opacity-60 pointer-events-none">
        <button onClick={scrollLeft} className="w-10 h-10 bg-white shadow-md rounded-full flex items-center justify-center border border-slate-200 pointer-events-auto">
          <i className="fas fa-chevron-left text-slate-400"></i>
        </button>
      </div>
      <div className="absolute top-[200px] right-2 z-10 opacity-60 pointer-events-none">
        <button onClick={scrollRight} className="w-10 h-10 bg-white shadow-md rounded-full flex items-center justify-center border border-slate-200 pointer-events-auto">
          <i className="fas fa-chevron-right text-slate-400"></i>
        </button>
      </div>

      {/* Horizontal Sliding Columns Container */}
      <div 
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto px-6 pb-12 snap-x snap-mandatory scrollbar-hide"
      >
        {columns.map(col => (
          <div key={col.id} className="min-w-[85vw] sm:min-w-[340px] snap-center flex flex-col space-y-6">
            {/* Pill Header precisely matching screenshot (Black bg, colored text) */}
            <div className="flex items-center justify-between px-6 py-4 rounded-full bg-[#1e293b] shadow-xl border border-slate-800">
              <h3 className={`font-black text-[12px] uppercase tracking-[0.15em] ${col.color}`}>
                {language === 'hi' ? col.hi : col.en}
              </h3>
              <span className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center font-black text-white text-[11px] border border-white/20">
                {leads.filter(l => l.status === col.id).length}
              </span>
            </div>

            {/* Leads List */}
            <div className="space-y-6">
              {leads.filter(l => l.status === col.id).map(lead => (
                <div key={lead.id} className={`bg-white rounded-[2.5rem] p-1 border-2 ${col.border} shadow-2xl shadow-slate-200/50 transition-all duration-300 transform active:scale-95`}>
                  <div className="bg-white rounded-[2.2rem] p-6 space-y-5">
                    <div className="flex justify-between items-start">
                      <h4 className="font-black text-slate-900 text-xl tracking-tight leading-tight">{lead.name}</h4>
                      <button className="w-9 h-9 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center border border-slate-100">
                        <i className="fas fa-pencil text-sm"></i>
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                       <span className="text-[11px] font-black text-white bg-slate-900 px-4 py-2 rounded-xl shadow-md uppercase tracking-tight">
                         {lead.amount}
                       </span>
                       <span className="text-[10px] font-black text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg flex items-center gap-2 uppercase tracking-widest border border-indigo-100">
                         <i className="fas fa-user-circle text-xs"></i> {lead.assignedTo || 'SELF'}
                       </span>
                    </div>

                    <div className="bg-slate-50/80 p-5 rounded-[1.5rem] border border-slate-100">
                      <p className="text-sm font-bold text-slate-600 leading-relaxed">
                        {lead.detail}
                      </p>
                    </div>

                    {/* Progress-styled Update Button matching screenshot */}
                    <button 
                      onClick={() => {
                        const nextCol = col.id === 'NAYA' ? 'BAAT_CHAL_RAHI' : col.id === 'BAAT_CHAL_RAHI' ? 'PAKKA' : 'NAYA';
                        moveLead(lead.id, nextCol as LeadStatus);
                      }}
                      className="w-full relative h-14 bg-gradient-to-r from-indigo-500 to-indigo-700 text-white rounded-[1.5rem] font-black uppercase text-xs tracking-[0.2em] shadow-lg shadow-indigo-100 overflow-hidden flex items-center justify-center gap-3 hover:brightness-110 active:scale-[0.98] transition-all"
                    >
                      <div className="absolute inset-0 bg-white/10 w-3/4"></div> {/* Progress fill effect */}
                      <span className="relative z-10">{language === 'hi' ? 'अपडेट' : 'Update'}</span>
                      <i className="fas fa-arrow-right-long relative z-10 scale-110"></i>
                    </button>
                  </div>
                </div>
              ))}
              {leads.filter(l => l.status === col.id).length === 0 && (
                <div className="text-center py-24 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[3rem] opacity-40">
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">No Items</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer / Vyapar App Feature Card */}
      <div className="px-6 pb-20">
        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 p-8 rounded-[3rem] shadow-2xl relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl"></div>
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center text-white">
                <i className="fas fa-file-invoice text-xl"></i>
              </div>
              <h3 className="text-white font-black text-lg">Vyapar Accounting</h3>
            </div>
            <p className="text-indigo-200 text-xs font-bold leading-relaxed">
              Pura hisaab-kitab manager. Generate digital invoices, track GST, and manage inventory with Sudarshan AI.
            </p>
            <button className="bg-white text-indigo-900 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl">
              Launch Vyapar App
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KanbanBoard;
