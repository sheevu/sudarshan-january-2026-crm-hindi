
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
      label: label || (showAddTx.type === 'SALE' ? 'General Sale' : 'Manual Entry'),
      amount: numAmount,
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
    };

    // Automated Ledger Calculation Logic
    let newDue = localCustomer.due_amount;
    switch (newTx.type) {
      case 'SALE':
        newDue += numAmount; // They owe more
        break;
      case 'PAYMENT_RECEIVED':
      case 'PURCHASE':
      case 'EXPENSE':
        newDue -= numAmount; // Credits/Payments reduce their debt
        break;
      default:
        break;
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
    <div className="p-6 pb-32 space-y-8 bg-white min-h-screen">
      <div className="flex items-center gap-5">
        <button onClick={onBack} className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-900 border-2 border-slate-200 active:scale-90 transition-transform shadow-sm">
          <i className="fas fa-arrow-left text-xl"></i>
        </button>
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter leading-none">{localCustomer.business_name}</h1>
          <p className="text-sm text-indigo-700 uppercase tracking-[0.2em] font-black mt-2">Business Khata</p>
        </div>
      </div>

      <div className="bg-slate-900 p-8 rounded-[3rem] border border-slate-800 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <i className="fas fa-receipt text-[140px] text-white"></i>
        </div>
        <div className="flex justify-between items-start relative z-10">
          <div className="space-y-2">
            <p className="text-xs text-slate-400 font-black uppercase tracking-[0.3em]">Total Baki (Net Due)</p>
            <p className={`text-6xl font-black tracking-tighter ${localCustomer.due_amount > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
              ₹{localCustomer.due_amount.toLocaleString('en-IN')}
            </p>
            <div className="flex items-center gap-3 pt-3">
               <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
               <p className="text-[11px] text-slate-400 font-black uppercase tracking-widest">Hisaab Updated Live</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] px-2 flex items-center gap-2">
           <i className="fas fa-bolt-lightning text-orange-500"></i> Quick Entry
        </h3>
        <div className="grid grid-cols-2 gap-5">
          <button 
            onClick={() => setShowAddTx({ open: true, type: 'SALE' })}
            className="flex flex-col items-center justify-center gap-4 p-8 rounded-[2.5rem] bg-rose-50 text-rose-800 border-2 border-rose-100 hover:bg-rose-100 active:scale-95 transition-all shadow-md group"
          >
            <i className="fas fa-cart-arrow-down text-3xl group-hover:scale-110 transition-transform"></i>
            <span className="text-xs font-black uppercase tracking-widest">Bikri (Sale)</span>
          </button>
          <button 
            onClick={() => setShowAddTx({ open: true, type: 'PAYMENT_RECEIVED' })}
            className="flex flex-col items-center justify-center gap-4 p-8 rounded-[2.5rem] bg-emerald-50 text-emerald-800 border-2 border-emerald-100 hover:bg-emerald-100 active:scale-95 transition-all shadow-md group"
          >
            <i className="fas fa-indian-rupee-sign text-3xl group-hover:scale-110 transition-transform"></i>
            <span className="text-xs font-black uppercase tracking-widest">Jama (Recv)</span>
          </button>
        </div>
        <div className="grid grid-cols-2 gap-5">
           <button 
            onClick={() => setShowAddTx({ open: true, type: 'PURCHASE' })}
            className="flex flex-col items-center justify-center gap-4 p-8 rounded-[2.5rem] bg-blue-50 text-blue-800 border-2 border-blue-100 hover:bg-blue-100 active:scale-95 transition-all shadow-sm"
          >
            <i className="fas fa-box text-2xl"></i>
            <span className="text-[10px] font-black uppercase tracking-widest">Purchase</span>
          </button>
          <button 
            onClick={() => setShowAddTx({ open: true, type: 'EXPENSE' })}
            className="flex flex-col items-center justify-center gap-4 p-8 rounded-[2.5rem] bg-slate-50 text-slate-800 border-2 border-slate-200 hover:bg-slate-100 active:scale-95 transition-all shadow-sm"
          >
            <i className="fas fa-tags text-2xl"></i>
            <span className="text-[10px] font-black uppercase tracking-widest">Expense</span>
          </button>
        </div>
      </div>

      <div className="space-y-6 pt-4">
        <div className="flex justify-between items-center px-2">
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">Ledger History</h3>
          <button onClick={shareWhatsApp} className="text-emerald-700 font-black text-xs uppercase tracking-widest flex items-center gap-2 bg-emerald-50 px-5 py-3 rounded-2xl border-2 border-emerald-100 shadow-sm active:scale-95">
             <i className="fab fa-whatsapp text-lg"></i> Send Reminder
          </button>
        </div>
        
        {localCustomer.transactions.length > 0 ? (
          <div className="space-y-5">
            {localCustomer.transactions.map((t, i) => (
              <div key={i} className="bg-white p-7 rounded-[3rem] flex justify-between items-center border-2 border-slate-50 shadow-sm hover:shadow-xl transition-all group active:scale-[0.98]">
                <div className="flex items-center gap-6">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl ${
                    t.type === 'SALE' ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
                  } border-2 border-white shadow-sm`}>
                    <i className={`fas ${t.type === 'SALE' ? 'fa-plus' : 'fa-minus'}`}></i>
                  </div>
                  <div>
                    <p className="text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{t.label}</p>
                    <p className="text-[11px] text-slate-400 font-black uppercase tracking-widest mt-1">{t.date || 'Aaj'} • {t.type.replace('_', ' ')}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-2xl font-black tracking-tighter ${t.type === 'SALE' ? 'text-rose-600' : 'text-emerald-700'}`}>
                    {t.type === 'SALE' ? '+' : '-'}₹{t.amount.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-slate-50 rounded-[4rem] border-4 border-dashed border-slate-200">
            <i className="fas fa-layer-group text-6xl mb-6 text-slate-200"></i>
            <p className="text-lg font-black text-slate-400 uppercase tracking-[0.2em]">No transactions yet</p>
          </div>
        )}
      </div>

      {showAddTx.open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-2xl animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-sm p-10 rounded-[4rem] border border-slate-200 shadow-2xl animate-in zoom-in-95 duration-200 space-y-8">
            <div className="text-center space-y-3">
              <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Nayi Entry</h2>
              <p className="text-[11px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 py-2 px-5 rounded-full inline-block border border-indigo-100">
                Adding {showAddTx.type}
              </p>
            </div>
            
            <div className="space-y-6">
               <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase ml-4 tracking-widest">Rakam (Amount)</label>
                <div className="relative">
                  <span className="absolute left-7 top-1/2 -translate-y-1/2 font-black text-slate-900 text-4xl">₹</span>
                  <input 
                    type="number" 
                    placeholder="0.00"
                    className="w-full bg-slate-50 border-4 border-slate-100 rounded-[2.5rem] pl-16 pr-8 py-8 text-5xl font-black text-slate-900 outline-none focus:ring-8 focus:ring-indigo-100 transition-all shadow-inner"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    autoFocus
                  />
                </div>
               </div>
               <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase ml-4 tracking-widest">Vivran (Detail)</label>
                <input 
                  type="text" 
                  placeholder="Items ya bill number..."
                  className="w-full bg-slate-50 border-4 border-slate-100 rounded-[2rem] px-8 py-6 text-xl font-black text-slate-900 outline-none focus:ring-8 focus:ring-indigo-100 shadow-inner"
                  value={label}
                  onChange={e => setLabel(e.target.value)}
                />
               </div>
            </div>

            <div className="flex gap-5 pt-4">
              <button 
                onClick={() => setShowAddTx({ open: false, type: '' })} 
                className="flex-1 py-7 font-black text-slate-400 uppercase text-xs tracking-widest hover:text-slate-900 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddTx} 
                className="flex-[2] py-7 bg-indigo-600 text-white rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] shadow-2xl shadow-indigo-200 active:scale-95 transition-all"
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
