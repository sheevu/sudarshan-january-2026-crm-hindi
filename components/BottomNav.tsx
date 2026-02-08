
import React from 'react';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  language: 'en' | 'hi';
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab, language }) => {
  const tabs = [
    { id: 'dashboard', icon: 'fa-chart-pie', en: 'Stats', hi: 'आंकड़े', color: 'text-orange-600' },
    { id: 'customers', icon: 'fa-book-open', en: 'Khata', hi: 'खाता', color: 'text-indigo-600' },
    { id: 'leads', icon: 'fa-layer-group', en: 'Tasks', hi: 'काम', color: 'text-blue-600' },
    { id: 'diary', icon: 'fa-book-sparkles', en: 'Diary', hi: 'डायरी', color: 'text-amber-600' },
    { id: 'chat', icon: 'fa-comment-sparkles', en: 'Asst.', hi: 'सहायक', color: 'text-rose-600' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 md:relative bg-white border-t border-slate-200 flex justify-around py-5 pb-9 z-50 rounded-t-[3.5rem] shadow-[0_-20px_50px_rgba(0,0,0,0.06)]">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center gap-2 px-2 py-1 transition-all duration-300 ${
              isActive ? tab.color : 'text-slate-500'
            }`}
          >
            <div className={`flex items-center justify-center w-11 h-11 transition-all duration-300 ${isActive ? 'bg-slate-50 rounded-2xl shadow-inner border border-slate-100' : ''}`}>
               <i className={`fas ${tab.icon} ${isActive ? 'text-2xl' : 'text-xl opacity-70'}`}></i>
            </div>
            <span className={`text-[11px] font-black uppercase tracking-[0.1em] ${isActive ? 'opacity-100 scale-105' : 'opacity-60 font-extrabold'}`}>
              {language === 'hi' ? tab.hi : tab.en}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;
