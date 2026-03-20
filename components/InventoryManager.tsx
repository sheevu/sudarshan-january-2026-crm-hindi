import React, { useState } from 'react';
import { Product } from '../types';
import { Package, Plus, Search, Trash2, Edit2, AlertTriangle, LayoutGrid, Volume2, Sparkles, Loader2 } from 'lucide-react';
import { generateSpeech } from '../services/gemini';

const InventoryManager: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([
    { id: '1', name: 'Aloo (Potato)', category: 'Vegetables', price: 30, stock: 150, unit: 'kg' },
    { id: '2', name: 'Pyaj (Onion)', category: 'Vegetables', price: 45, stock: 80, unit: 'kg' },
    { id: '3', name: 'Tamatar (Tomato)', category: 'Vegetables', price: 60, stock: 20, unit: 'kg' },
    { id: '4', name: 'Doodh (Milk)', category: 'Dairy', price: 65, stock: 50, unit: 'L' },
    { id: '5', name: 'Chawal (Rice)', category: 'Grains', price: 80, stock: 200, unit: 'kg' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    category: '',
    price: 0,
    stock: 0,
    unit: 'kg'
  });

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProduct = () => {
    if (newProduct.name && newProduct.price && newProduct.stock) {
      const product: Product = {
        id: Math.random().toString(36).substr(2, 9),
        name: newProduct.name,
        category: newProduct.category || 'General',
        price: Number(newProduct.price),
        stock: Number(newProduct.stock),
        unit: newProduct.unit || 'kg'
      };
      setProducts([...products, product]);
      setIsAdding(false);
      setNewProduct({ name: '', category: '', price: 0, stock: 0, unit: 'kg' });
    }
  };

  const deleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const handleVoiceReport = async () => {
    setIsSpeaking(true);
    const lowStockItems = products.filter(p => p.stock < 30);
    const totalItems = products.length;
    
    let reportText = `Namaste! Aaj ki inventory report. Aapke paas total ${totalItems} products hain. `;
    if (lowStockItems.length > 0) {
      reportText += `Dhyan dein, ${lowStockItems.length} items ka stock kam hai. `;
      lowStockItems.forEach(item => {
        reportText += `${item.name} sirf ${item.stock} ${item.unit} bacha hai. `;
      });
      reportText += "Kripya inka stock jald hi mangwa lein. Dhanyawad!";
    } else {
      reportText += "Sabhi items ka stock sahi hai. Business badhate rahein! Dhanyawad.";
    }

    await generateSpeech(reportText, 'Kore');
    setIsSpeaking(false);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 pb-32 bg-slate-50/30 min-h-screen">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tighter text-slate-900">Inventory</h1>
          <p className="text-[10px] font-black text-orange-700 uppercase tracking-[0.2em] mt-1">Stock & Products</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleVoiceReport}
            disabled={isSpeaking}
            className="w-12 h-12 bg-white text-indigo-600 rounded-2xl flex items-center justify-center shadow-md border border-slate-100 active:scale-95 transition-all disabled:opacity-50"
          >
            {isSpeaking ? <Loader2 size={20} className="animate-spin" /> : <Volume2 size={20} />}
          </button>
          <button 
            onClick={() => setIsAdding(true)}
            className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-orange-200 active:scale-95 transition-all"
          >
            <LayoutGrid size={24} />
          </button>
        </div>
      </header>

      {/* Daily Insights Card */}
      <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-6 rounded-[2.5rem] text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <Sparkles size={120} />
        </div>
        <div className="relative z-10 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-black text-indigo-100 uppercase tracking-[0.2em]">Daily Insights</p>
              <h2 className="text-2xl font-black mt-1">Stock Summary</h2>
            </div>
            <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
              Live
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="bg-white/10 backdrop-blur-sm p-3 sm:p-4 rounded-2xl border border-white/10">
              <p className="text-[8px] sm:text-[9px] font-black text-indigo-100 uppercase tracking-widest">Total Items</p>
              <p className="text-xl sm:text-2xl font-black">{products.length}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-3 sm:p-4 rounded-2xl border border-white/10">
              <p className="text-[8px] sm:text-[9px] font-black text-indigo-100 uppercase tracking-widest">Low Stock</p>
              <p className="text-xl sm:text-2xl font-black text-rose-300">{products.filter(p => p.stock < 30).length}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-3 sm:p-4 rounded-2xl border border-white/10 col-span-2">
              <p className="text-[8px] sm:text-[9px] font-black text-indigo-100 uppercase tracking-widest">Total Stock Value</p>
              <p className="text-xl sm:text-2xl font-black">₹{products.reduce((acc, p) => acc + (p.price * p.stock), 0).toLocaleString('en-IN')}</p>
            </div>
          </div>

          <button 
            onClick={handleVoiceReport}
            disabled={isSpeaking}
            className="w-full py-4 bg-white text-indigo-700 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition-all"
          >
            {isSpeaking ? <Loader2 size={14} className="animate-spin" /> : <Volume2 size={14} />}
            Listen Insights in Hindi
          </button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input 
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-11 pr-4 py-3 sm:py-4 bg-slate-100 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none font-bold text-slate-700 transition-all text-sm sm:text-base"
        />
      </div>

      {/* Low Stock Alert */}
      {products.some(p => p.stock < 30) && (
        <div className="bg-amber-50/50 border border-amber-100 p-4 rounded-2xl flex items-center gap-3">
          <AlertTriangle className="text-amber-600" size={20} />
          <p className="text-[10px] font-black text-amber-800 uppercase tracking-[0.15em]">
            SOME ITEMS ARE RUNNING LOW ON STOCK!
          </p>
        </div>
      )}

      {/* Product List */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredProducts.map(product => (
          <div key={product.id} className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
            <div className="flex flex-col gap-3">
              <div className="flex gap-3">
                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 border border-slate-100 shrink-0">
                  <Package size={20} />
                </div>
                <div className="min-w-0">
                  <h3 className="font-black text-sm text-slate-900 leading-tight truncate">{product.name}</h3>
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest truncate">{product.category}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-xs font-black text-slate-900">₹{product.price}</p>
                <div className={`inline-flex items-center px-2 py-1 rounded-lg border text-[8px] font-black uppercase tracking-widest ${
                  product.stock < 30 
                    ? 'bg-rose-50 text-rose-600 border-rose-100' 
                    : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                }`}>
                  STK: {product.stock} {product.unit.toUpperCase()}
                </div>
              </div>
            </div>
            
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity absolute top-2 right-2 bg-white/90 backdrop-blur-sm p-1 rounded-lg border border-slate-100 shadow-sm">
              <button className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors">
                <Edit2 size={14} />
              </button>
              <button 
                onClick={() => deleteProduct(product.id)}
                className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Product Modal */}
      {isAdding && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 space-y-6 shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black tracking-tight text-slate-900">Add Product</h2>
              <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-slate-600">
                <Plus size={24} className="rotate-45" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Product Name</label>
                <input 
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-orange-500 outline-none font-bold"
                  placeholder="e.g. Aloo"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Price (₹)</label>
                  <input 
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: Number(e.target.value)})}
                    className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-orange-500 outline-none font-bold"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Stock</label>
                  <input 
                    type="number"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({...newProduct, stock: Number(e.target.value)})}
                    className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-orange-500 outline-none font-bold"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                  <input 
                    type="text"
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                    className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-orange-500 outline-none font-bold"
                    placeholder="Vegetables"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Unit</label>
                  <select 
                    value={newProduct.unit}
                    onChange={(e) => setNewProduct({...newProduct, unit: e.target.value})}
                    className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-orange-500 outline-none font-bold"
                  >
                    <option value="kg">kg</option>
                    <option value="L">L</option>
                    <option value="pcs">pcs</option>
                    <option value="pkt">pkt</option>
                  </select>
                </div>
              </div>
            </div>

            <button 
              onClick={handleAddProduct}
              className="w-full py-5 bg-orange-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-orange-100 active:scale-95 transition-all"
            >
              Save Product
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryManager;
