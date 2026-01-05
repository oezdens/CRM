import React, { useState, useEffect } from 'react';
import { Offer, Customer, Article, Position, OfferStatus } from '@/types';
import { ArrowLeft, Save, Trash2, Plus, Calendar, Hash, FileSpreadsheet, User, Briefcase, Phone, FileText } from 'lucide-react';

interface OfferEditorProps {
  offer?: Offer | null;
  customers: Customer[];
  articles: Article[];
  onSave: (offer: Offer) => void;
  onDelete: (id: string) => void;
  onCancel: () => void;
}

export const OfferEditor: React.FC<OfferEditorProps> = ({ 
  offer, 
  customers, 
  articles, 
  onSave, 
  onDelete, 
  onCancel 
}) => {
  const [formData, setFormData] = useState<Offer>({
    id: '',
    offerNumber: '',
    customerId: '',
    customerNameSnapshot: '',
    customerEmailSnapshot: '',
    customerAddressSnapshot: '',
    project: '',
    yourReference: '',
    inquiryDate: new Date().toISOString().split('T')[0],
    processor: 'Özden Admin',
    processorPhone: '',
    date: new Date().toISOString().split('T')[0],
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'Entwurf' as OfferStatus,
    positions: [],
    notes: '',
    totalNet: 0,
    taxRate: 19,
    totalGross: 0,
  });

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | undefined>(undefined);

  useEffect(() => {
    if (offer) {
      setFormData(offer);
      const cust = customers.find(c => c.id === offer.customerId);
      setSelectedCustomer(cust);
    } else {
      const currentYear = new Date().getFullYear();
      const randomId = Math.floor(1000 + Math.random() * 9000);
      setFormData(prev => ({
        ...prev,
        id: crypto.randomUUID(),
        offerNumber: `AN-${currentYear}-${randomId}`
      }));
    }
  }, [offer, customers]);

  useEffect(() => {
    const net = formData.positions.reduce((acc, curr) => acc + curr.total, 0);
    const gross = net * (1 + formData.taxRate / 100);
    setFormData(prev => ({
        ...prev,
        totalNet: net,
        totalGross: gross
    }));
  }, [formData.positions, formData.taxRate]);

  const handleCustomerChange = (customerId: string) => {
    const cust = customers.find(c => c.id === customerId);
    setSelectedCustomer(cust);
    
    // Auto-fill snapshots from selected customer
    setFormData(prev => ({ 
        ...prev, 
        customerId,
        customerNameSnapshot: cust ? (cust.company || cust.name) : '',
        customerEmailSnapshot: cust ? cust.email : '',
        customerAddressSnapshot: cust ? cust.address : ''
    }));
  };

  const handleAddPosition = () => {
    const newPos: Position = {
        id: crypto.randomUUID(),
        description: '',
        quantity: 1,
        unit: 'Stück',
        price: 0,
        total: 0
    };
    setFormData(prev => ({ ...prev, positions: [...prev.positions, newPos] }));
  };

  const handleRemovePosition = (id: string) => {
    setFormData(prev => ({ ...prev, positions: prev.positions.filter(p => p.id !== id) }));
  };

  const handlePositionChange = (id: string, field: keyof Position, value: any) => {
    setFormData(prev => {
        const updatedPositions = prev.positions.map(pos => {
            if (pos.id !== id) return pos;
            
            const updatedPos = { ...pos, [field]: value };
            if (field === 'quantity' || field === 'price') {
                updatedPos.total = Number(updatedPos.quantity) * Number(updatedPos.price);
            }
            return updatedPos;
        });
        return { ...prev, positions: updatedPositions };
    });
  };

  const handleArticleSelect = (posId: string, articleId: string) => {
    const article = articles.find(a => a.id === articleId);
    if (!article) return;

    setFormData(prev => {
        const updatedPositions = prev.positions.map(pos => {
            if (pos.id !== posId) return pos;
            return {
                ...pos,
                articleId: article.id,
                description: article.name, 
                unit: article.unit,
                price: article.price,
                total: article.price * pos.quantity
            };
        });
        return { ...prev, positions: updatedPositions };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="h-full flex flex-col bg-[#0B0F19] overflow-hidden animate-in fade-in duration-300">
      
      {/* Top Bar */}
      <div className="px-8 py-4 flex items-center justify-between bg-slate-900/40 backdrop-blur-md border-b border-white/5 sticky top-0 z-30">
        <div className="flex items-center gap-4">
            <button onClick={onCancel} className="flex items-center justify-center p-2 rounded-full bg-slate-800/50 hover:bg-slate-700 border border-white/5 hover:border-white/10 text-slate-400 hover:text-white transition-all">
                <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-semibold text-white">
                {offer ? `Angebot ${offer.offerNumber}` : 'Neues Angebot'}
            </h1>
        </div>
        <div className="flex gap-3">
            {offer && (
                <button onClick={() => onDelete(offer.id)} className="group flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-400 rounded-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] bg-slate-900/80 backdrop-blur-sm border border-red-500/30 hover:border-red-500/60 hover:shadow-[0_0_20px_rgba(239,68,68,0.15)]">
                    <Trash2 className="w-4 h-4" />
                    <span>Löschen</span>
                </button>
            )}
            <button onClick={handleSubmit} className="group flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 hover:border-indigo-500/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)]">
                <Save className="w-4 h-4 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
                <span>Speichern</span>
            </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
        <div className="max-w-6xl mx-auto space-y-8">

            {/* Top Grid - Matches Invoice Editor Structure */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Customer Section */}
                <div className="bg-slate-900/40 backdrop-blur-sm border border-white/5 rounded-3xl p-6 shadow-xl">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <User className="w-5 h-5 text-indigo-400" /> Kunde auswählen
                    </h3>
                    <div className="space-y-4">
                        <div className="relative">
                            <select 
                                value={formData.customerId} 
                                onChange={(e) => handleCustomerChange(e.target.value)}
                                className="w-full bg-slate-950/60 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 appearance-none"
                            >
                                <option value="">-- Kunde wählen --</option>
                                {customers.map(c => (
                                    <option key={c.id} value={c.id}>{c.company ? `${c.company} (${c.name})` : c.name}</option>
                                ))}
                            </select>
                            <div className="absolute right-4 top-4 w-2 h-2 border-r-2 border-b-2 border-slate-500 rotate-45 pointer-events-none"></div>
                        </div>

                        {selectedCustomer && (
                            <div className="bg-slate-950/30 rounded-xl p-4 border border-white/5 space-y-2 text-sm text-slate-400 animate-in fade-in slide-in-from-top-2">
                                <p className="font-semibold text-white text-base">{formData.customerNameSnapshot || selectedCustomer.company}</p>
                                <p>{formData.customerAddressSnapshot || selectedCustomer.address}</p>
                                <p>{formData.customerEmailSnapshot || selectedCustomer.email}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Offer Meta Data - Same structure as Invoice but with extra fields */}
                <div className="bg-slate-900/40 backdrop-blur-sm border border-white/5 rounded-3xl p-6 shadow-xl">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <FileSpreadsheet className="w-5 h-5 text-indigo-400" /> Angebotsdaten
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-500 uppercase">Angebotsnr.</label>
                            <div className="relative">
                                <Hash className="absolute left-3 top-2.5 w-4 h-4 text-slate-600" />
                                <input 
                                    type="text" 
                                    value={formData.offerNumber}
                                    onChange={(e) => setFormData(p => ({ ...p, offerNumber: e.target.value }))}
                                    className="w-full bg-slate-950/60 border border-slate-700/50 rounded-xl py-2 pl-9 pr-3 text-white focus:outline-none focus:border-indigo-500"
                                />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-500 uppercase">Status</label>
                            <div className="relative">
                                <select 
                                    value={formData.status}
                                    onChange={(e) => setFormData(p => ({ ...p, status: e.target.value as OfferStatus }))}
                                    className="w-full bg-slate-950/60 border border-slate-700/50 rounded-xl py-2 px-3 text-white focus:outline-none focus:border-indigo-500 appearance-none"
                                >
                                    <option value="Entwurf">Entwurf</option>
                                    <option value="Versendet">Versendet</option>
                                    <option value="Angenommen">Angenommen</option>
                                    <option value="Abgelehnt">Abgelehnt</option>
                                </select>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-500 uppercase">Angebotsdatum</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-slate-600" />
                                <input 
                                    type="date" 
                                    value={formData.date}
                                    onChange={(e) => setFormData(p => ({ ...p, date: e.target.value }))}
                                    className="w-full bg-slate-950/60 border border-slate-700/50 rounded-xl py-2 pl-9 pr-3 text-white focus:outline-none focus:border-indigo-500"
                                />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-500 uppercase">Gültig bis</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-slate-600" />
                                <input 
                                    type="date" 
                                    value={formData.validUntil}
                                    onChange={(e) => setFormData(p => ({ ...p, validUntil: e.target.value }))}
                                    className="w-full bg-slate-950/60 border border-slate-700/50 rounded-xl py-2 pl-9 pr-3 text-white focus:outline-none focus:border-indigo-500"
                                />
                            </div>
                        </div>
                        {/* Extra Fields for Offers */}
                        <div className="space-y-1 md:col-span-2">
                            <label className="text-xs font-semibold text-slate-500 uppercase">Projekt</label>
                            <div className="relative">
                                <Briefcase className="absolute left-3 top-2.5 w-4 h-4 text-slate-600" />
                                <input 
                                    type="text" 
                                    value={formData.project}
                                    onChange={(e) => setFormData(p => ({ ...p, project: e.target.value }))}
                                    className="w-full bg-slate-950/60 border border-slate-700/50 rounded-xl py-2 pl-9 pr-3 text-white focus:outline-none focus:border-indigo-500"
                                    placeholder="Projektname"
                                />
                            </div>
                        </div>
                         <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-500 uppercase">Bearbeiter</label>
                            <div className="relative">
                                <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-600" />
                                <input 
                                    type="text" 
                                    value={formData.processor}
                                    onChange={(e) => setFormData(p => ({ ...p, processor: e.target.value }))}
                                    className="w-full bg-slate-950/60 border border-slate-700/50 rounded-xl py-2 pl-9 pr-3 text-white focus:outline-none focus:border-indigo-500"
                                />
                            </div>
                        </div>
                         <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-500 uppercase">Ihr Zeichen</label>
                            <div className="relative">
                                <FileText className="absolute left-3 top-2.5 w-4 h-4 text-slate-600" />
                                <input 
                                    type="text" 
                                    value={formData.yourReference}
                                    onChange={(e) => setFormData(p => ({ ...p, yourReference: e.target.value }))}
                                    className="w-full bg-slate-950/60 border border-slate-700/50 rounded-xl py-2 pl-9 pr-3 text-white focus:outline-none focus:border-indigo-500"
                                    placeholder="Optional"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Positions Table - Identical to Invoice Editor */}
            <div className="bg-slate-900/40 backdrop-blur-sm border border-white/5 rounded-3xl p-6 shadow-xl">
                 <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-white">Positionen</h3>
                    <button 
                        onClick={handleAddPosition}
                        className="px-4 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 rounded-lg text-sm font-medium flex items-center gap-2 transition-all"
                    >
                        <Plus className="w-4 h-4" /> Position hinzufügen
                    </button>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                <th className="px-4 py-3 min-w-[200px]">Artikel / Beschreibung</th>
                                <th className="px-4 py-3 w-32">Menge</th>
                                <th className="px-4 py-3 w-32">Einheit</th>
                                <th className="px-4 py-3 w-40 text-right">Einzelpreis</th>
                                <th className="px-4 py-3 w-40 text-right">Gesamt</th>
                                <th className="px-4 py-3 w-12"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {formData.positions.map((pos) => (
                                <tr key={pos.id} className="group">
                                    <td className="px-4 py-3">
                                        <div className="space-y-2">
                                            <select 
                                                onChange={(e) => handleArticleSelect(pos.id, e.target.value)}
                                                className="w-full bg-transparent border-b border-slate-700 text-sm text-indigo-300 focus:outline-none focus:border-indigo-500 py-1 mb-1"
                                                value={pos.articleId || ''}
                                            >
                                                <option value="">Artikel wählen...</option>
                                                {articles.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                                            </select>
                                            <input 
                                                type="text" 
                                                value={pos.description}
                                                onChange={(e) => handlePositionChange(pos.id, 'description', e.target.value)}
                                                className="w-full bg-slate-950/30 border border-slate-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
                                                placeholder="Beschreibung"
                                            />
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 align-top pt-5">
                                        <input 
                                            type="number" 
                                            min="0"
                                            value={pos.quantity}
                                            onChange={(e) => handlePositionChange(pos.id, 'quantity', parseFloat(e.target.value))}
                                            className="w-full bg-slate-950/30 border border-slate-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
                                        />
                                    </td>
                                    <td className="px-4 py-3 align-top pt-5">
                                        <select 
                                            value={pos.unit}
                                            onChange={(e) => handlePositionChange(pos.id, 'unit', e.target.value)}
                                            className="w-full bg-slate-950/30 border border-slate-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
                                        >
                                            <option value="Stück">Stück</option>
                                            <option value="Stunde">Stunde</option>
                                            <option value="Pauschal">Pauschal</option>
                                        </select>
                                    </td>
                                    <td className="px-4 py-3 align-top pt-5 text-right">
                                        <input 
                                            type="number" 
                                            min="0"
                                            step="0.01"
                                            value={pos.price}
                                            onChange={(e) => handlePositionChange(pos.id, 'price', parseFloat(e.target.value))}
                                            className="w-full bg-slate-950/30 border border-slate-800 rounded-lg px-3 py-2 text-white text-sm text-right focus:outline-none focus:border-indigo-500"
                                        />
                                    </td>
                                    <td className="px-4 py-3 align-top pt-7 text-right font-mono text-slate-300">
                                        {pos.total.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                                    </td>
                                    <td className="px-4 py-3 align-top pt-6 text-center">
                                        <button 
                                            onClick={() => handleRemovePosition(pos.id)}
                                            className="text-slate-600 hover:text-red-400 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {formData.positions.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-4 py-8 text-center text-slate-500 italic">
                                        Keine Positionen hinzugefügt.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer Totals */}
                <div className="mt-8 flex justify-end">
                    <div className="w-80 space-y-3">
                        <div className="pt-3 border-t border-white/10 flex justify-between items-center">
                            <span className="text-lg font-bold text-white">Gesamtbetrag</span>
                            <span className="text-xl font-bold text-indigo-400">{formData.totalNet.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-400">Anmerkungen</label>
                <textarea 
                    value={formData.notes}
                    onChange={(e) => setFormData(p => ({ ...p, notes: e.target.value }))}
                    className="w-full bg-slate-900/40 border border-slate-800/50 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 min-h-[100px]"
                    placeholder="Optionale Anmerkungen zum Angebot..."
                />
            </div>

        </div>
      </div>
    </div>
  );
};
