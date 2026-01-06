
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
      color: 'text-blue-700', 
      bg: 'bg-blue-50', 
      icon: 'fa-shopping-cart' 
    },
    { 
      label: language === 'hi' ? 'विज़िटर' : 'Visitors', 
      value: '1,740', 
      trend: '+18%', 
      color: 'text-purple-700', 
      bg: 'bg-purple-50', 
      icon: 'fa-users' 
    },
    { 
      label: language === 'hi' ? 'कन्वर्शन' : 'Conversion', 
      value: '4.2%', 
      trend: '+5%', 
      color: 'text-emerald-700', 
      bg: 'bg-emerald-50', 
      icon: 'fa-chart-pie' 
    },
  ];

  return (
    <div className="p-6 space-y-8 pb-32 bg-slate-50/30 min-h-screen text-slate-900">
      <header className="space-y-2 py-4">
        <h1 className="text-4xl font-black tracking-tighter text-slate-900 leading-none">
          {language === 'hi' ? 'नमस्ते! स्वागत है' : 'Namaste! Welcome'}
        </h1>
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">
            {language === 'hi' ? 'आज का व्यापार' : 'Today\'s Business'}
          </p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Live</span>
          </div>
        </div>
      </header>

      {/* Primary Actions - Swift Flow */}
      <div className="grid grid-cols-2 gap-4">
        <button className="flex flex-col items-center justify-center gap-3 bg-indigo-600 text-white p-7 rounded-[2.5rem] shadow-xl shadow-indigo-100 active:scale-95 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
            <i className="fas fa-expand text-2xl"></i>
          </div>
          <span className="text-xs font-black uppercase tracking-widest">{language === 'hi' ? 'स्कैन करें' : 'Quick Scan'}</span>
        </button>
        <button className="flex flex-col items-center justify-center gap-3 bg-white text-slate-900 border border-slate-200 p-7 rounded-[2.5rem] shadow-sm active:scale-95 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
            <i className="fas fa-file-invoice text-2xl text-indigo-600"></i>
          </div>
          <span className="text-xs font-black uppercase tracking-widest">{language === 'hi' ? 'रिपोर्ट' : 'Get Report'}</span>
        </button>
      </div>

      <div className="space-y-5">
        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">Key Metrics</h3>
        <div className="grid grid-cols-1 gap-5">
          {analytics.map((stat, i) => (
            <div key={i} className="bg-white p-7 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-black text-slate-500 uppercase mb-2 tracking-widest">{stat.label}</p>
                  <p className="text-3xl font-black text-slate-900">{stat.value}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-xs font-bold ${stat.color}`}>{stat.trend}</span>
                    <i className={`fas fa-arrow-trend-up text-[10px] ${stat.color}`}></i>
                  </div>
                </div>
                <div className={`${stat.bg} ${stat.color} w-14 h-14 rounded-2xl flex items-center justify-center border border-slate-100 shadow-sm`}>
                  <i className={`fas ${stat.icon} text-xl`}></i>
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
