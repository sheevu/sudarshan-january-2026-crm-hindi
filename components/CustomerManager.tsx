
import React, { useState } from 'react';
import { Customer } from '../types';
import { Plus, Search, User, Phone, ChevronRight } from 'lucide-react';

interface CustomerManagerProps {
  onSelectCustomer: (customer: Customer) => void;
}

const CustomerManager: React.FC<CustomerManagerProps> = ({ onSelectCustomer }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([
    { 
      id: '1', 
      business_name: 'Gupta General Store', 
      owner_name: 'Rajesh Gupta', 
      phone: '9876543210', 
      created_at: new Date().toISOString(),
      due_amount: 4500,
      transactions: [
        { type: 'SALE', label: 'Monthly Groceries', amount: 3000, date: '2026-03-10' },
        { type: 'SALE', label: 'Oil and Dal', amount: 1500, date: '2026-03-15' }
      ]
    },
    { 
      id: '2', 
      business_name: 'Sharma Sweets', 
      owner_name: 'Amit Sharma', 
      phone: '9123456789', 
      created_at: new Date().toISOString(),
      due_amount: 1200,
      transactions: [
        { type: 'SALE', label: 'Diwali Box Order', amount: 2000, date: '2026-03-10' },
        { type: 'PAYMENT_RECEIVED', label: 'Cash Payment', amount: 800, date: '2026-03-11' }
      ]
    },
    { 
      id: '3', 
      business_name: 'Prakash Kirana', 
      owner_name: 'Om Prakash', 
      phone: '8877665544', 
      created_at: new Date().toISOString(),
      due_amount: 0,
      transactions: []
    }
  ]);

  const [newCust, setNewCust] = useState({ biz: '', owner: '', phone: '' });

  const handleAdd = () => {
    if (!newCust.biz) return;
    const nc: Customer = {
      id: Date.now().toString(),
      business_name: newCust.biz,
      owner_name: newCust.owner,
      phone: newCust.phone,
      created_at: new Date().toISOString(),
      due_amount: 0,
      transactions: []
    };
    setCustomers([nc, ...customers]);
    setNewCust({ biz: '', owner: '', phone: '' });
    setShowAddModal(false);
  };

  return (
    <div className="p-6 space-y-8 pb-32 bg-white min-h-screen">
      <div className="flex justify-between items-center py-2">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Customer List</h1>
          <p className="text-sm text-indigo-700 font-extrabold uppercase tracking-[0.2em] mt-1">Aapka Business Khata</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-indigo-600 text-white w-16 h-16 rounded-[1.5rem] shadow-2xl shadow-indigo-200 active:scale-90 transition-transform flex items-center justify-center border-4 border-white"
        >
          <Plus size={28} />
        </button>
      </div>

      <div className="relative group">
        <input 
          type="text" 
          placeholder="Dukan ya phone number dhoondein..."
          className="w-full bg-slate-50 border-2 border-slate-200 rounded-[2rem] px-16 py-6 text-lg text-slate-900 font-bold focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all placeholder:text-slate-400 shadow-inner"
        />
        <Search className="absolute left-7 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={24} />
      </div>

      <div className="space-y-6">
        {customers.map((c) => (
          <div key={c.id} className="bg-white p-7 rounded-[3rem] border-2 border-slate-100 flex justify-between items-center hover:shadow-2xl transition-all group shadow-sm active:scale-[0.98]">
            <div className="space-y-3">
              <p className="text-2xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors tracking-tight leading-tight">{c.business_name}</p>
              <div className="flex flex-col gap-2 text-sm text-slate-600 font-extrabold">
                <span className="flex items-center gap-2"><User size={16} className="text-indigo-400" /> {c.owner_name}</span>
                <span className="flex items-center gap-2"><Phone size={16} className="text-emerald-400" /> {c.phone}</span>
              </div>
            </div>
            <div className="text-right flex flex-col items-end gap-5">
              <div className="space-y-1">
                <p className={`text-2xl font-black ${c.due_amount > 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
                  {c.due_amount > 0 ? `₹${c.due_amount.toLocaleString('en-IN')}` : 'Settled'}
                </p>
                <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Baki Amount</p>
              </div>
              <button 
                onClick={() => onSelectCustomer(c)}
                className="text-xs uppercase font-black text-indigo-700 bg-indigo-50 px-6 py-4 rounded-2xl border-2 border-indigo-100 active:scale-95 transition-all shadow-sm flex items-center gap-2"
              >
                Khata Dekhein <ChevronRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/70 backdrop-blur-lg animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-sm p-10 rounded-[4rem] border border-slate-200 shadow-2xl space-y-8 animate-in zoom-in-95 duration-200">
            <h2 className="text-3xl font-black text-slate-900 text-center uppercase tracking-tighter">Naya Customer</h2>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-4 tracking-[0.2em]">Dukan Ka Naam</label>
                <input 
                  type="text" 
                  placeholder="Business Name"
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl px-6 py-5 text-lg text-slate-900 font-bold placeholder:text-slate-300 outline-none focus:ring-4 focus:ring-indigo-100"
                  value={newCust.biz}
                  onChange={e => setNewCust({...newCust, biz: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-4 tracking-[0.2em]">Owner Ka Naam</label>
                <input 
                  type="text" 
                  placeholder="Owner Name"
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl px-6 py-5 text-lg text-slate-900 font-bold placeholder:text-slate-300 outline-none focus:ring-4 focus:ring-indigo-100"
                  value={newCust.owner}
                  onChange={e => setNewCust({...newCust, owner: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-4 tracking-[0.2em]">Phone Number</label>
                <input 
                  type="text" 
                  placeholder="WhatsApp Number"
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl px-6 py-5 text-lg text-slate-900 font-bold placeholder:text-slate-300 outline-none focus:ring-4 focus:ring-indigo-100"
                  value={newCust.phone}
                  onChange={e => setNewCust({...newCust, phone: e.target.value})}
                />
              </div>
            </div>
            <div className="flex gap-5 pt-4">
              <button onClick={() => setShowAddModal(false)} className="flex-1 py-5 font-black text-slate-400 uppercase text-xs tracking-widest hover:text-slate-900">Cancel</button>
              <button onClick={handleAdd} className="flex-[2] py-5 bg-indigo-600 text-white rounded-3xl font-black uppercase text-xs tracking-[0.2em] shadow-2xl shadow-indigo-200 active:scale-95 transition-all">Add Customer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerManager;
