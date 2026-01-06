
import React, { useState } from 'react';
import { Customer, Transaction, TransactionType } from '../types';

interface CustomerLedgerProps {
  customer: Customer;
  onBack: () => void;
}

const CustomerLedger: React.FC<CustomerLedgerProps> = ({ customer, onBack }) => {
  const [localCustomer, setLocalCustomer] = useState<Customer>(customer);
  const [showAddTx, setShowAddTx] = useState<{ open: boolean, type: TransactionType | '' }>({ open: false, type: '' });
  const [amount, setAmount] = useState('');
  const [label, setLabel] = useState('');

  const handleAddTx = () => {
    if (!amount || !showAddTx.type) return;
    
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) return;

    const newTx: Transaction = {
      type: showAddTx.type as TransactionType,
      label: label || (showAddTx.type === 'SALE' ? 'General Sale' : 'Transaction'),
      amount: numAmount,
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
    };

    // Auto-update logic: 
    // SALE increases what they owe us. 
    // PAYMENT_RECEIVED decreases what they owe us.
    let newDue = localCustomer.due_amount;
    if (newTx.type === 'SALE') {
      newDue += numAmount;
    } else if (newTx.type === 'PAYMENT_RECEIVED') {
      newDue -= numAmount;
    }

    setLocalCustomer({
      ...localCustomer,
      due_amount: newDue,
      transactions: [newTx, ...localCustomer.transactions]
    });

    setShowAddTx({ open: false, type: '' });
    setAmount('');
    setLabel('');
  };

  const shareWhatsApp = () => {
    const msg = `Namaste ${localCustomer.owner_name} ji, aapka total baki amount ₹${localCustomer.due_amount} hai. Kripya jald hi clear karein. - Sudarshan CRM`;
    window.open(`https://wa.me/${localCustomer.phone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="p-5 pb-24 space-y-7 bg-white min-h-screen">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="w-11 h-11 rounded-full bg-slate-100 flex items-center justify-center text-slate-900 border border-slate-200 active:scale-90 transition-transform shadow-sm">
          <i className="fas fa-arrow-left text-lg"></i>
        </button>
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">{localCustomer.business_name}</h1>
          <p className="text-xs text-indigo-700 uppercase tracking-[0.2em] font-black">Ledger Details</p>
        </div>
      </div>

      <div className="bg-slate-50 p-7 rounded-[2.5rem] border border-slate-200 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <i className="fas fa-wallet text-7xl text-slate-900"></i>
        </div>
        <div className="flex justify-between items-start relative z-10">
          <div>
            <p className="text-xs text-slate-500 font-black uppercase tracking-widest mb-3">Total Outstanding</p>
            <p className={`text-5xl font-black ${localCustomer.due_amount > 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
              ₹{localCustomer.due_amount.toLocaleString('en-IN')}
            </p>
            <p className="text-xs text-slate-600 mt-3 font-bold flex items-center gap-1.5">
              <i className="fas fa-clock text-xs"></i> Last update: Just now
            </p>
          </div>
          <div className="w-16 h-16 rounded-3xl bg-white flex items-center justify-center text-indigo-600 border border-slate-200 shadow-sm">
            <i className="fas fa-file-invoice-dollar text-3xl"></i>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest px-1 flex items-center gap-2">
           <span className="w-1.5 h-4 bg-indigo-600 rounded-full"></span> Quick Entry
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => setShowAddTx({ open: true, type: 'SALE' })}
            className="flex items-center justify-center gap-3 p-5 rounded-[2rem] bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-100 active:scale-95 transition-all shadow-sm"
          >
            <i className="fas fa-plus-circle text-2xl"></i>
            <span className="text-sm font-black uppercase tracking-tighter">Bikri (Sale)</span>
          </button>
          <button 
            onClick={() => setShowAddTx({ open: true, type: 'PAYMENT_RECEIVED' })}
            className="flex items-center justify-center gap-3 p-5 rounded-[2rem] bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-100 active:scale-95 transition-all shadow-sm"
          >
            <i className="fas fa-hand-holding-dollar text-2xl"></i>
            <span className="text-sm font-black uppercase tracking-tighter">Payment</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={shareWhatsApp}
          className="bg-emerald-600 text-white py-4 rounded-[1.5rem] text-sm font-black flex items-center justify-center gap-3 active:scale-95 transition-all shadow-lg shadow-emerald-600/20"
        >
          <i className="fab fa-whatsapp text-xl"></i> Reminder
        </button>
        <button 
          className="bg-slate-900 text-white py-4 rounded-[1.5rem] text-sm font-black flex items-center justify-center gap-3 active:scale-95 transition-all shadow-lg shadow-slate-900/20"
        >
          <i className="fas fa-file-pdf text-xl"></i> Ledger
        </button>
      </div>

      <div className="space-y-5">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-lg font-black text-slate-900 tracking-tight">Recent Transactions</h3>
          <span className="text-xs font-black text-indigo-600 uppercase">View All <i className="fas fa-chevron-right text-[10px]"></i></span>
        </div>
        {localCustomer.transactions.length > 0 ? (
          <div className="space-y-4">
            {localCustomer.transactions.map((t, i) => (
              <div key={i} className="bg-white p-5 rounded-[2rem] flex justify-between items-center border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${
                    t.type === 'SALE' ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
                  } border border-slate-100`}>
                    <i className={`fas ${t.type === 'SALE' ? 'fa-cart-shopping' : 'fa-handshake-angle'}`}></i>
                  </div>
                  <div>
                    <p className="text-base font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{t.label}</p>
                    <p className="text-xs text-slate-500 font-bold uppercase mt-1">{t.date || 'Today'}</p>
                  </div>
                </div>
                <p className={`font-black text-lg ${t.type === 'SALE' ? 'text-rose-600' : 'text-emerald-700'}`}>
                  {t.type === 'SALE' ? '+' : '-'}₹{t.amount.toLocaleString('en-IN')}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-300">
            <i className="fas fa-history text-4xl mb-4 text-slate-300"></i>
            <p className="text-sm font-bold text-slate-500 italic">Abhi koi entry nahi hai</p>
          </div>
        )}
      </div>

      {showAddTx.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-sm p-8 rounded-[3rem] border border-slate-200 shadow-2xl animate-in slide-in-from-bottom-8 duration-300">
            <div className="text-center space-y-2 mb-6">
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-widest">Nayi Entry</h2>
              <p className="text-xs font-bold text-indigo-600 uppercase tracking-[0.2em]">{showAddTx.type} for {localCustomer.owner_name}</p>
            </div>
            
            <div className="space-y-6">
               <div>
                <label className="text-[11px] font-black text-slate-400 uppercase ml-2 mb-2 block">Rakam (Amount)</label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-slate-400 text-xl">₹</span>
                  <input 
                    type="number" 
                    placeholder="0.00"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-5 py-5 text-2xl font-black text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/20"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    autoFocus
                  />
                </div>
               </div>
               <div>
                <label className="text-[11px] font-black text-slate-400 uppercase ml-2 mb-2 block">Kiske Liye? (Label)</label>
                <input 
                  type="text" 
                  placeholder="e.g. Monthly Bill, Payment..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/20"
                  value={label}
                  onChange={e => setLabel(e.target.value)}
                />
               </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button 
                onClick={() => setShowAddTx({ open: false, type: '' })} 
                className="flex-1 py-4 font-black text-slate-500 uppercase text-xs tracking-widest"
              >
                Wapas
              </button>
              <button 
                onClick={handleAddTx} 
                className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-indigo-600/30"
              >
                Save Karein
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerLedger;
