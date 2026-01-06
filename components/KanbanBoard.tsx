
import React, { useState } from 'react';
import { Lead, LeadStatus } from '../types';

interface KanbanBoardProps {
  language: 'en' | 'hi';
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ language }) => {
  const [leads, setLeads] = useState<Lead[]>([
    { id: '1', name: 'Ramesh Halwai', detail: 'Party order for Sunday sweets', amount: '₹15,000', status: 'NAYA', assignedTo: 'Self' },
    { id: '2', name: 'Suresh Tailor', detail: 'Bulk thread stock order', amount: '₹2,000', status: 'BAAT_CHAL_RAHI', reminderDate: '2023-11-20', assignedTo: 'Ravi' },
    { id: '3', name: 'Anita Boutique', detail: 'Wedding Season Sarees Bulk', amount: '₹55,000', status: 'PAKKA', assignedTo: 'Meena' },
  ]);

  const moveLead = (id: string, newStatus: LeadStatus) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));
  };

  const columns: { id: LeadStatus, en: string, hi: string, color: string, border: string }[] = [
    { id: 'NAYA', en: 'New Leads', hi: 'नए लोग', color: 'text-orange-400', border: 'border-orange-500' },
    { id: 'BAAT_CHAL_RAHI', en: 'In Progress', hi: 'बात चल रही है', color: 'text-blue-400', border: 'border-blue-500' },
    { id: 'PAKKA', en: 'Deal Won', hi: 'डील पक्की', color: 'text-emerald-400', border: 'border-emerald-500' }
  ];

  return (
    <div className="p-0 space-y-4 bg-white min-h-screen">
      <header className="flex justify-between items-center px-6 pt-8 pb-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none">
            {language === 'hi' ? 'काम की लिस्ट' : 'Task List'}
          </h1>
          <p className="text-xs text-indigo-700 font-bold uppercase tracking-[0.2em] mt-2">
            {language === 'hi' ? 'लीड्स और टास्क मैनेजमेंट' : 'Leads & Tasks Management'}
          </p>
        </div>
        <button className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-xl shadow-indigo-100 active:scale-90 transition-transform">
          <i className="fas fa-plus text-xl"></i>
        </button>
      </header>

      {/* Horizontal Sliding Columns Container */}
      <div className="flex gap-4 overflow-x-auto px-6 pb-12 snap-x snap-mandatory scrollbar-hide">
        {columns.map(col => (
          <div key={col.id} className="min-w-[85vw] sm:min-w-[340px] snap-center flex flex-col space-y-6">
            {/* Pill Header precisely matching screenshot */}
            <div className="flex items-center justify-between px-6 py-4 rounded-full bg-slate-900 shadow-lg shadow-slate-200">
              <h3 className={`font-black text-[11px] uppercase tracking-[0.15em] ${col.color}`}>
                {language === 'hi' ? col.hi : col.en}
              </h3>
              <span className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center font-black text-white text-[10px]">
                {leads.filter(l => l.status === col.id).length}
              </span>
            </div>

            {/* Leads List */}
            <div className="space-y-6">
              {leads.filter(l => l.status === col.id).map(lead => (
                <div key={lead.id} className={`bg-slate-50 rounded-[2.5rem] p-1 border-4 ${col.border} shadow-xl shadow-slate-100 transition-all duration-300 animate-in fade-in zoom-in-95`}>
                  <div className="bg-white rounded-[2rem] p-6 space-y-5">
                    <div className="flex justify-between items-start">
                      <h4 className="font-black text-slate-900 text-2xl tracking-tight leading-tight">{lead.name}</h4>
                      <button className="w-9 h-9 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
                        <i className="fas fa-pen text-sm"></i>
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                       <span className="text-sm font-black text-white bg-slate-900 px-4 py-2 rounded-xl shadow-md">
                         {lead.amount}
                       </span>
                       <span className="text-[10px] font-black text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg flex items-center gap-2 uppercase tracking-widest">
                         <i className="fas fa-user-circle text-sm"></i> {lead.assignedTo || 'Unassigned'}
                       </span>
                    </div>

                    <p className="text-base font-bold text-slate-600 leading-relaxed bg-slate-50/50 p-4 rounded-2xl">
                      {lead.detail}
                    </p>

                    <button 
                      onClick={() => {
                        const nextCol = col.id === 'NAYA' ? 'BAAT_CHAL_RAHI' : col.id === 'BAAT_CHAL_RAHI' ? 'PAKKA' : 'NAYA';
                        moveLead(lead.id, nextCol as LeadStatus);
                      }}
                      className="w-full h-14 bg-indigo-600 text-white rounded-[1.5rem] font-black uppercase text-xs tracking-[0.2em] shadow-lg shadow-indigo-100 flex items-center justify-center gap-3 active:scale-95 transition-all"
                    >
                      {language === 'hi' ? 'अपडेट' : 'Update'} <i className="fas fa-arrow-right-long scale-110"></i>
                    </button>
                  </div>
                </div>
              ))}
              {leads.filter(l => l.status === col.id).length === 0 && (
                <div className="text-center py-20 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[3rem] opacity-40">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Empty List</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;
