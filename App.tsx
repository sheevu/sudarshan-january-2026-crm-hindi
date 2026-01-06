
import React, { useState } from 'react';
import BottomNav from './components/BottomNav';
import Dashboard from './components/Dashboard';
import DiaryAnalyzer from './components/DiaryAnalyzer';
import ChatAgent from './components/ChatAgent';
import CustomerManager from './components/CustomerManager';
import CustomerLedger from './components/CustomerLedger';
import KanbanBoard from './components/KanbanBoard';
import VoiceAssistant from './components/VoiceAssistant';
import { Customer } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [language, setLanguage] = useState<'en' | 'hi'>('hi');

  const handleCustomerSelect = (customer: Customer) => {
    setSelectedCustomer(customer);
  };

  const renderContent = () => {
    if (selectedCustomer) {
      return <CustomerLedger customer={selectedCustomer} onBack={() => setSelectedCustomer(null)} />;
    }

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard language={language} />;
      case 'customers':
        return <CustomerManager onSelectCustomer={handleCustomerSelect} />;
      case 'leads':
        return <KanbanBoard language={language} />;
      case 'diary':
        return <DiaryAnalyzer />;
      case 'chat':
        return <ChatAgent />;
      case 'voice':
        return <VoiceAssistant />;
      default:
        return <Dashboard language={language} />;
    }
  };

  const handleTabChange = (tab: string) => {
    setSelectedCustomer(null);
    setActiveTab(tab);
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'hi' : 'en');
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex justify-center selection:bg-orange-200">
      <div className="w-full max-w-md bg-white min-h-screen flex flex-col relative shadow-2xl overflow-x-hidden border-x border-slate-200">
        <header className="bg-white/95 backdrop-blur-xl border-b border-slate-200 p-5 flex items-center justify-between sticky top-0 z-40 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#FF9933] to-[#138808] rounded-2xl flex items-center justify-center text-white font-black shadow-lg rotate-3">
              <span className="text-xl -rotate-3">S</span>
            </div>
            <div>
              <span className="font-black text-2xl text-slate-900 tracking-tighter block leading-none">Sudarshan</span>
              <span className="text-xs font-black text-orange-700 uppercase tracking-[0.2em] block mt-1.5 opacity-90">
                {language === 'hi' ? 'AI बिज़नेस सहायक' : 'AI MSME Assistant'}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={toggleLanguage}
              className="px-4 h-11 rounded-xl bg-slate-100 flex items-center justify-center text-xs font-black text-slate-700 hover:text-slate-900 transition-all border border-slate-300 uppercase tracking-widest"
            >
              {language === 'hi' ? 'ENG' : 'हिंदी'}
            </button>
            <button className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 border border-slate-300">
              <i className="fas fa-bell text-lg"></i>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-slate-50/50 scroll-smooth">
          {renderContent()}
        </main>

        {!selectedCustomer && (
          <BottomNav activeTab={activeTab} setActiveTab={handleTabChange} language={language} />
        )}
      </div>
    </div>
  );
};

export default App;
