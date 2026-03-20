
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, LineChart, Line } from 'recharts';
import { TrendingUp, Users, PieChart as PieChartIcon, ShoppingCart, ArrowRight, Receipt, Expand, FileText, Activity } from 'lucide-react';

interface DashboardProps {
  language: 'en' | 'hi';
}

const Dashboard: React.FC<DashboardProps> = ({ language }) => {
  const data = [
    { name: 'Mon', sales: 4000, expenses: 2400 },
    { name: 'Tue', sales: 3000, expenses: 1398 },
    { name: 'Wed', sales: 2000, expenses: 9800 },
    { name: 'Thu', sales: 2780, expenses: 3908 },
    { name: 'Fri', sales: 1890, expenses: 4800 },
    { name: 'Sat', sales: 2390, expenses: 3800 },
    { name: 'Sun', sales: 3490, expenses: 4300 },
  ];

  const categoryData = [
    { name: 'Vegetables', value: 400 },
    { name: 'Fruits', value: 300 },
    { name: 'Dairy', value: 300 },
    { name: 'Grains', value: 200 },
  ];

  const growthData = [
    { month: 'Jan', customers: 100 },
    { month: 'Feb', customers: 120 },
    { month: 'Mar', customers: 150 },
    { month: 'Apr', customers: 180 },
    { month: 'May', customers: 210 },
    { month: 'Jun', customers: 250 },
  ];

  const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444'];

  const analytics = [
    { 
      label: language === 'hi' ? 'कुल बिक्री' : 'Total Sales', 
      value: '₹1,24,400', 
      trend: '+24%', 
      color: 'text-blue-800', 
      bg: 'bg-blue-50', 
      icon: <ShoppingCart size={24} /> 
    },
    { 
      label: language === 'hi' ? 'विज़िटर' : 'Visitors', 
      value: '1,740', 
      trend: '+18%', 
      color: 'text-purple-800', 
      bg: 'bg-purple-50', 
      icon: <Users size={24} /> 
    },
    { 
      label: language === 'hi' ? 'कन्वर्शन' : 'Conversion', 
      value: '4.2%', 
      trend: '+5%', 
      color: 'text-emerald-800', 
      bg: 'bg-emerald-50', 
      icon: <PieChartIcon size={24} /> 
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
            <Expand size={32} />
          </div>
          <span className="text-sm font-black uppercase tracking-widest">{language === 'hi' ? 'स्कैन करें' : 'Quick Scan'}</span>
        </button>
        <button className="flex flex-col items-center justify-center gap-4 bg-white text-slate-900 border-2 border-slate-200 p-8 rounded-[3rem] shadow-md active:scale-95 transition-all">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center border border-slate-200">
            <FileText size={32} className="text-indigo-600" />
          </div>
          <span className="text-sm font-black uppercase tracking-widest">{language === 'hi' ? 'रिपोर्ट' : 'Get Report'}</span>
        </button>
      </div>

      {/* Infographics Section */}
      <div className="space-y-6">
        <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] px-2">Business Insights</h3>
        
        {/* Sales vs Expenses Bar Chart */}
        <div className="bg-white p-6 rounded-[2.5rem] border-2 border-slate-100 shadow-lg">
          <h4 className="text-sm font-black text-slate-900 mb-6 uppercase tracking-widest">Sales vs Expenses</h4>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 800, fill: '#94a3b8' }} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 800 }}
                  cursor={{ fill: '#f8fafc' }}
                />
                <Bar dataKey="sales" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="expenses" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown Pie Chart */}
        <div className="bg-white p-6 rounded-[2.5rem] border-2 border-slate-100 shadow-lg flex flex-col items-center">
          <h4 className="text-sm font-black text-slate-900 mb-6 uppercase tracking-widest w-full">Sales by Category</h4>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 w-full mt-4">
            {categoryData.map((cat, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }}></div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{cat.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Growth Line Chart */}
        <div className="bg-white p-6 rounded-[2.5rem] border-2 border-slate-100 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Customer Growth</h4>
            <Activity size={16} className="text-indigo-600" />
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 800, fill: '#94a3b8' }} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 800 }}
                />
                <Line type="monotone" dataKey="customers" stroke="#4f46e5" strokeWidth={4} dot={{ r: 6, fill: '#4f46e5', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Vyapar Accounting App Banner */}
      <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-950 p-8 rounded-[3rem] shadow-2xl text-white relative overflow-hidden group border border-white/10">
        <div className="absolute -top-10 -right-10 opacity-10 group-hover:scale-125 transition-transform duration-700">
          <Receipt size={120} />
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
            Open Dashboard <ArrowRight size={16} className="inline ml-2" />
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
                       <TrendingUp size={10} />
                    </div>
                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Growth</span>
                  </div>
                </div>
                <div className={`${stat.bg} ${stat.color} w-16 h-16 rounded-[1.5rem] flex items-center justify-center border-2 border-slate-100 shadow-sm transition-transform group-hover:rotate-12`}>
                  {stat.icon}
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
