
import React, { useState } from 'react';
import { Customer } from '../types';

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
      due_amount: 4500,
      transactions: [
        { type: 'SALE', label: 'Monthly Groceries', amount: 3000, date: '12 Oct' },
        { type: 'SALE', label: 'Oil and Dal', amount: 1500, date: '15 Oct' }
      ]
    },
    { 
      id: '2', 
      business_name: 'Sharma Sweets', 
      owner_name: 'Amit Sharma', 
      phone: '9123456789', 
      due_amount: 1200,
      transactions: [
        { type: 'SALE', label: 'Diwali Box Order', amount: 2000, date: '10 Oct' },
        { type: 'PAYMENT_RECEIVED', label: 'Cash Payment', amount: 800, date: '11 Oct' }
      ]
    },
    { 
      id: '3', 
      business_name: 'Prakash Kirana', 
      owner_name: 'Om Prakash', 
      phone: '8877665544', 
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
      due_amount: 0,
      transactions: []
    };
    setCustomers([nc, ...customers]);
    setNewCust({ biz: '', owner: '', phone: '' });
    setShowAddModal(false);
  };

  return (
    <div className="p-6 space-y-7 pb-24 bg-white min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Customer List</h1>
          <p className="text-xs text-indigo-700 font-bold uppercase tracking-widest mt-1">Aapka Khata Book</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-indigo-600 text-white w-14 h-14 rounded-2xl shadow-lg shadow-indigo-600/20 active:scale-90 transition-transform flex items-center justify-center border border-indigo-500"
        >
          <i className="fas fa-plus text-xl"></i>
        </button>
      </div>

      <div className="relative group">
        <input 
          type="text" 
          placeholder="Dukan ya phone number dhoondein..."
          className="w-full bg-slate-50 border border-slate-200 rounded-3xl px-14 py-5 text-base text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-400 font-bold shadow-sm"
        />
        <i className="fas fa-search absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors text-lg"></i>
      </div>

      <div className="space-y-5">
        {customers.map((c) => (
          <div key={c.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 flex justify-between items-center hover:shadow-lg transition-all group shadow-sm">
            <div className="space-y-2">
              <p className="text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight">{c.business_name}</p>
              <div className="flex flex-col gap-1 text-sm text-slate-500 font-bold">
                <span className="flex items-center gap-2"><i className="fas fa-user text-xs text-indigo-400"></i> {c.owner_name}</span>
                <span className="flex items-center gap-2"><i className="fas fa-phone text-xs text-emerald-400"></i> {c.phone}</span>
              </div>
            </div>
            <div className="text-right flex flex-col items-end gap-4">
              <div>
                <p className={`text-xl font-black ${c.due_amount > 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
                  {c.due_amount > 0 ? `₹${c.due_amount.toLocaleString('en-IN')}` : 'Settled'}
                </p>
                <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-0.5">Outstanding</p>
              </div>
              <button 
                onClick={() => onSelectCustomer(c)}
                className="text-xs uppercase font-black text-indigo-700 bg-indigo-50 px-5 py-3 rounded-2xl border border-indigo-100 active:scale-95 transition-all shadow-sm"
              >
                Khata Dekhein
              </button>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-sm p-8 rounded-[3rem] border border-slate-200 shadow-2xl space-y-7 animate-in zoom-in-95 duration-200">
            <h2 className="text-2xl font-black text-slate-900 text-center uppercase tracking-tight">Naya Customer</h2>
            <div className="space-y-5">
              <input 
                type="text" 
                placeholder="Business Ka Naam"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-base text-slate-900 font-bold placeholder:text-slate-400 outline-none focus:ring-4 focus:ring-indigo-500/10"
                value={newCust.biz}
                onChange={e => setNewCust({...newCust, biz: e.target.value})}
              />
              <input 
                type="text" 
                placeholder="Owner Ka Naam"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-base text-slate-900 font-bold placeholder:text-slate-400 outline-none focus:ring-4 focus:ring-indigo-500/10"
                value={newCust.owner}
                onChange={e => setNewCust({...newCust, owner: e.target.value})}
              />
              <input 
                type="text" 
                placeholder="Phone Number"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-base text-slate-900 font-bold placeholder:text-slate-400 outline-none focus:ring-4 focus:ring-indigo-500/10"
                value={newCust.phone}
                onChange={e => setNewCust({...newCust, phone: e.target.value})}
              />
            </div>
            <div className="flex gap-4">
              <button onClick={() => setShowAddModal(false)} className="flex-1 py-4 font-black text-slate-400 uppercase text-xs tracking-widest">Cancel</button>
              <button onClick={handleAdd} className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-indigo-600/20">Add Karein</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerManager;
