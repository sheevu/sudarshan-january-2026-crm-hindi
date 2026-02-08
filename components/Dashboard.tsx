
import React from 'react';

interface DashboardProps {
  language: 'en' | 'hi';
}

const Dashboard: React.FC<DashboardProps> = ({ language }) => {
  const analytics = [
    { 
      label: language === 'hi' ? 'कुल बिक्री' : 'Total Sales', 
      value: '₹1,24,400', 
      trend: '+24%', 
      color: 'text-blue-800', 
      bg: 'bg-blue-50', 
      icon: 'fa-shopping-cart' 
    },
    { 
      label: language === 'hi' ? 'विज़िटर' : 'Visitors', 
      value: '1,740', 
      trend: '+18%', 
      color: 'text-purple-800', 
      bg: 'bg-purple-50', 
      icon: 'fa-users' 
    },
    { 
      label: language === 'hi' ? 'कन्वर्शन' : 'Conversion', 
      value: '4.2%', 
      trend: '+5%', 
      color: 'text-emerald-800', 
      bg: 'bg-emerald-50', 
      icon: 'fa-chart-pie' 
    },
  ];

  return (
    <div className="p-6 space-y-10 pb-32 bg-slate-50/30 min-h-screen text-slate-900">
      <header className="space-y-3 py-4">
        <h1 className="text-5xl font-black tracking-tighter text-slate-900 leading-none">
          {language === 'hi' ? 'नमस्ते! स्वागत है' : 'Namaste! Welcome'}
        </h1>
        <div className="flex items-center justify-between">
          <p className="text-base text-slate-600 font-extrabold uppercase tracking-widest">
            {language === 'hi' ? 'आज का व्यापार' : 'Today\'s Business'}
          </p>
          <div className="flex items-center gap-3 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-black text-emerald-700 uppercase tracking-widest">Live Updates</span>
          </div>
        </div>
      </header>

      {/* Primary Actions - Swift Flow */}
      <div className="grid grid-cols-2 gap-5">
        <button className="flex flex-col items-center justify-center gap-4 bg-indigo-600 text-white p-8 rounded-[3rem] shadow-2xl shadow-indigo-100 active:scale-95 transition-all">
          <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm border border-white/30">
            <i className="fas fa-expand text-3xl"></i>
          </div>
          <span className="text-sm font-black uppercase tracking-widest">{language === 'hi' ? 'स्कैन करें' : 'Quick Scan'}</span>
        </button>
        <button className="flex flex-col items-center justify-center gap-4 bg-white text-slate-900 border-2 border-slate-200 p-8 rounded-[3rem] shadow-md active:scale-95 transition-all">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center border border-slate-200">
            <i className="fas fa-file-invoice text-3xl text-indigo-600"></i>
          </div>
          <span className="text-sm font-black uppercase tracking-widest">{language === 'hi' ? 'रिपोर्ट' : 'Get Report'}</span>
        </button>
      </div>

      {/* Vyapar Accounting App Banner */}
      <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-950 p-8 rounded-[3rem] shadow-2xl text-white relative overflow-hidden group border border-white/10">
        <div className="absolute -top-10 -right-10 opacity-10 group-hover:scale-125 transition-transform duration-700">
          <i className="fas fa-receipt text-[120px]"></i>
        </div>
        <div className="relative z-10 space-y-5">
          <div className="flex items-center gap-3">
             <span className="bg-emerald-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Digital Suite</span>
             <h3 className="text-2xl font-black tracking-tight">Vyapar App</h3>
          </div>
          <p className="text-sm font-bold opacity-90 leading-relaxed max-w-[240px]">
            GST Billing, Stock and Inventory track karein. Professional invoices ready in seconds.
          </p>
          <button className="bg-white text-indigo-900 px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-all">
            Open Dashboard <i className="fas fa-arrow-right ml-2"></i>
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] px-2">Key Business Metrics</h3>
        <div className="grid grid-cols-1 gap-6">
          {analytics.map((stat, i) => (
            <div key={i} className="bg-white p-8 rounded-[3rem] border-2 border-slate-100 shadow-lg relative overflow-hidden group hover:shadow-2xl transition-all">
              <div className="flex justify-between items-center">
                <div className="space-y-2">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">{stat.label}</p>
                  <p className="text-4xl font-black text-slate-900 tracking-tighter">{stat.value}</p>
                  <div className="flex items-center gap-3 mt-3">
                    <div className={`px-3 py-1 rounded-lg ${stat.bg} ${stat.color} flex items-center gap-1`}>
                       <span className="text-sm font-black">{stat.trend}</span>
                       <i className="fas fa-arrow-trend-up text-[10px]"></i>
                    </div>
                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Growth</span>
                  </div>
                </div>
                <div className={`${stat.bg} ${stat.color} w-16 h-16 rounded-[1.5rem] flex items-center justify-center border-2 border-slate-100 shadow-sm transition-transform group-hover:rotate-12`}>
                  <i className={`fas ${stat.icon} text-2xl`}></i>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
