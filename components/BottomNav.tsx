
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
    { id: 'voice', icon: 'fa-microphone-lines', en: 'Voice', hi: 'आवाज़', color: 'text-green-700' },
    { id: 'chat', icon: 'fa-comment-sparkles', en: 'Asst.', hi: 'सहायक', color: 'text-rose-600' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 md:relative bg-white border-t border-slate-200 flex justify-around py-4 pb-8 z-50 rounded-t-[3rem] shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center gap-1.5 px-3 py-1 transition-all duration-300 ${
              isActive ? tab.color : 'text-slate-500'
            }`}
          >
            <div className={`flex items-center justify-center w-9 h-9 transition-all duration-300 ${isActive ? 'bg-slate-100 rounded-xl shadow-sm' : ''}`}>
               <i className={`fas ${tab.icon} ${isActive ? 'text-xl' : 'text-lg'}`}></i>
            </div>
            <span className={`text-[10px] font-black uppercase tracking-[0.05em] ${isActive ? 'opacity-100 font-bold' : 'opacity-70'}`}>
              {language === 'hi' ? tab.hi : tab.en}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;
