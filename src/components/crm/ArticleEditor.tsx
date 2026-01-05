import React, { useState, useEffect } from 'react';
import { Article } from '@/types';
import { ArrowLeft, Save, Package, Tag, FileText, Hash, Euro, CheckCircle2, Trash2 } from 'lucide-react';

interface ArticleEditorProps {
  article?: Article | null;
  onSave: (article: Article) => void;
  onDelete: (id: string) => void;
  onCancel: () => void;
}

export const ArticleEditor: React.FC<ArticleEditorProps> = ({ article, onSave, onDelete, onCancel }) => {
  const [formData, setFormData] = useState<Article>({
    id: '',
    sku: '',
    name: '',
    description: '',
    price: 0,
    unit: 'Stück',
    isActive: true,
  });

  useEffect(() => {
    if (article) {
      setFormData(article);
    } else {
      setFormData(prev => ({
        ...prev,
        id: crypto.randomUUID(),
        sku: `VK-${Math.floor(100 + Math.random() * 900).toString()}`
      }));
    }
  }, [article]);

  const handleChange = (field: keyof Article, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const getInitials = (name: string) => {
    return name ? name.substring(0, 2).toUpperCase() : 'NE';
  };

  return (
    <div className="h-full flex flex-col bg-[#0B0F19] overflow-hidden animate-in fade-in duration-300">
      
      {/* Top Navigation Bar */}
      <div className="px-8 py-4 flex items-center justify-between bg-slate-900/40 backdrop-blur-md border-b border-white/5 sticky top-0 z-30">
        <div className="flex items-center gap-4">
            <button 
                onClick={onCancel}
                className="flex items-center justify-center p-2 rounded-full bg-slate-800/50 hover:bg-slate-700 border border-white/5 hover:border-white/10 text-slate-400 hover:text-white transition-all"
            >
                <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-semibold text-white">
                {article ? 'Artikel bearbeiten' : 'Neuer Artikel'}
            </h1>
        </div>
        <div className="flex gap-3">
             {article && (
                <button 
                    onClick={() => onDelete(article.id)}
                    className="group flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-400 rounded-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] bg-slate-900/80 backdrop-blur-sm border border-red-500/30 hover:border-red-500/60 hover:shadow-[0_0_20px_rgba(239,68,68,0.15)]"
                >
                    <Trash2 className="w-4 h-4" />
                    <span>Löschen</span>
                </button>
            )}
            <button 
                onClick={handleSubmit}
                className="group flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 hover:border-indigo-500/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)]"
            >
                <Save className="w-4 h-4 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
                <span>Speichern</span>
            </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden relative">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-1/3 h-full bg-indigo-600/5 blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-1/3 h-full bg-emerald-600/5 blur-[100px] pointer-events-none"></div>

        <div className="h-full overflow-y-auto custom-scrollbar">
            <div className="max-w-7xl mx-auto p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left Column: Product Card */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="sticky top-8">
                        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl overflow-hidden relative group">
                            <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 to-transparent opacity-50"></div>
                            
                            <div className="relative z-10 flex flex-col items-start text-left">
                                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-[0_10px_40px_rgba(16,185,129,0.3)] flex items-center justify-center mb-6 border-2 border-slate-900 transform transition-transform group-hover:scale-105 duration-500">
                                    <span className="text-3xl font-bold text-white tracking-widest">{getInitials(formData.name)}</span>
                                </div>
                                
                                <h2 className="text-2xl font-bold text-white mb-1 break-words w-full">
                                    {formData.name || <span className="text-slate-600 italic">Neuer Artikel</span>}
                                </h2>
                                
                                <div className="mt-2 text-3xl font-mono text-emerald-400 font-bold">
                                    {Number(formData.price).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                                </div>
                                <p className="text-slate-500 text-sm mt-1">pro {formData.unit}</p>

                                <div className="mt-6 w-full pt-6 border-t border-white/5">
                                    <div className="flex items-center justify-between text-sm text-slate-400 mb-4">
                                        <span>Artikelnummer (SKU)</span>
                                        <span className="text-white font-mono bg-slate-800/50 px-2 py-1 rounded-md">{formData.sku}</span>
                                    </div>
                                    
                                    <div className="bg-slate-950/50 rounded-xl p-3 border border-white/5 flex items-center justify-between">
                                        <span className="text-sm font-medium text-slate-400">Status</span>
                                        <div 
                                            onClick={() => handleChange('isActive', !formData.isActive)}
                                            className={`cursor-pointer px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${formData.isActive ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-700/50 text-slate-400 border border-slate-600'}`}
                                        >
                                            {formData.isActive ? <CheckCircle2 className="w-3 h-3" /> : <div className="w-3 h-3 rounded-full bg-slate-500"></div>}
                                            {formData.isActive ? 'Aktiv' : 'Inaktiv'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Details Form */}
                <div className="lg:col-span-8 space-y-6">
                    
                    {/* General Info Card */}
                    <div className="bg-slate-900/40 backdrop-blur-sm border border-white/5 rounded-3xl p-8 shadow-xl">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-3 bg-emerald-500/20 rounded-2xl text-emerald-400">
                                <Package className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">Artikeldetails</h3>
                                <p className="text-slate-400 text-sm">Basisinformationen zum Produkt</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2 group">
                                <label className="text-xs font-semibold text-emerald-400/80 uppercase tracking-widest ml-1">Artikelname <span className="text-red-400">*</span></label>
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        value={formData.name}
                                        onChange={(e) => handleChange('name', e.target.value)}
                                        className="w-full bg-slate-950/60 border border-slate-700/50 rounded-xl px-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all hover:bg-slate-950"
                                        placeholder="z.B. Visitenkarten Premium"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-emerald-400/80 uppercase tracking-widest ml-1">Artikelbeschreibung</label>
                                <div className="relative">
                                    <FileText className="absolute right-4 top-4 w-5 h-5 text-slate-600 pointer-events-none" />
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => handleChange('description', e.target.value)}
                                        rows={4}
                                        className="w-full bg-slate-950/60 border border-slate-700/50 rounded-xl px-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all hover:bg-slate-950 resize-none"
                                        placeholder="Detaillierte Beschreibung des Artikels..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Pricing & Settings Card */}
                    <div className="bg-slate-900/40 backdrop-blur-sm border border-white/5 rounded-3xl p-8 shadow-xl">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-3 bg-emerald-500/20 rounded-2xl text-emerald-400">
                                <Tag className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">Preise & Einstellungen</h3>
                                <p className="text-slate-400 text-sm">Konditionen und Identifikation</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div className="space-y-2">
                                <label className="text-xs font-semibold text-emerald-400/80 uppercase tracking-widest ml-1">Preis (€) <span className="text-red-400">*</span></label>
                                <div className="relative">
                                    <Euro className="absolute right-4 top-3.5 w-5 h-5 text-slate-600 pointer-events-none" />
                                    <input 
                                        type="number"
                                        min="0"
                                        step="0.01" 
                                        value={formData.price}
                                        onChange={(e) => handleChange('price', parseFloat(e.target.value))}
                                        className="w-full bg-slate-950/60 border border-slate-700/50 rounded-xl px-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all hover:bg-slate-950 font-mono"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-emerald-400/80 uppercase tracking-widest ml-1">Einheit</label>
                                <div className="relative">
                                    <select 
                                        value={formData.unit}
                                        onChange={(e) => handleChange('unit', e.target.value)}
                                        className="w-full bg-slate-950/60 border border-slate-700/50 rounded-xl px-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all hover:bg-slate-950 appearance-none"
                                    >
                                        <option value="Stück">Stück</option>
                                        <option value="Stunde">Stunde</option>
                                        <option value="Meter">Meter</option>
                                        <option value="kg">kg</option>
                                        <option value="Pauschal">Pauschal</option>
                                    </select>
                                    <div className="absolute right-4 top-4 w-2 h-2 border-r-2 border-b-2 border-slate-500 rotate-45 pointer-events-none"></div>
                                </div>
                            </div>

                            <div className="md:col-span-2 space-y-2">
                                <label className="text-xs font-semibold text-emerald-400/80 uppercase tracking-widest ml-1">Artikelnummer (SKU)</label>
                                <div className="relative">
                                    <Hash className="absolute right-4 top-3.5 w-5 h-5 text-slate-600 pointer-events-none" />
                                    <input 
                                        type="text" 
                                        value={formData.sku}
                                        onChange={(e) => handleChange('sku', e.target.value)}
                                        className="w-full bg-slate-950/60 border border-slate-700/50 rounded-xl px-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all hover:bg-slate-950 font-mono"
                                    />
                                </div>
                            </div>

                             <div className="md:col-span-2 pt-4">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className={`w-6 h-6 rounded-md border flex items-center justify-center transition-all ${formData.isActive ? 'bg-emerald-500 border-emerald-500' : 'bg-slate-950 border-slate-600 group-hover:border-slate-500'}`}>
                                        {formData.isActive && <CheckCircle2 className="w-4 h-4 text-white" />}
                                        <input 
                                            type="checkbox" 
                                            className="hidden" 
                                            checked={formData.isActive} 
                                            onChange={(e) => handleChange('isActive', e.target.checked)} 
                                        />
                                    </div>
                                    <span className={`font-medium ${formData.isActive ? 'text-white' : 'text-slate-400'}`}>Artikel ist aktiv</span>
                                </label>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
