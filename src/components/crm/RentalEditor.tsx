import React, { useState, useEffect } from 'react';
import { RentalContract, Customer } from '@/types';
import { ArrowLeft, Save, Trash2, Calendar, Hash, User, Euro, Key } from 'lucide-react';

interface RentalEditorProps {
  rental?: RentalContract | null;
  customers: Customer[];
  onSave: (rental: RentalContract) => void;
  onDelete: (id: string) => void;
  onCancel: () => void;
}

export const RentalEditor: React.FC<RentalEditorProps> = ({ 
  rental, 
  customers, 
  onSave, 
  onDelete, 
  onCancel 
}) => {
  const [formData, setFormData] = useState<RentalContract>({
    id: '',
    contractNumber: '',
    customerId: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: null,
    monthlyPrice: 0,
    description: '',
    payments: {}
  });

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | undefined>(undefined);
  const [isUnlimited, setIsUnlimited] = useState(true);

  useEffect(() => {
    if (rental) {
      setFormData(rental);
      const cust = customers.find(c => c.id === rental.customerId);
      setSelectedCustomer(cust);
      setIsUnlimited(rental.endDate === null);
    } else {
      const currentYear = new Date().getFullYear();
      const randomId = Math.floor(1000 + Math.random() * 9000);
      setFormData(prev => ({
        ...prev,
        id: crypto.randomUUID(),
        contractNumber: `MV-${currentYear}-${randomId}`,
        endDate: null
      }));
      setIsUnlimited(true);
    }
  }, [rental, customers]);

  const handleCustomerChange = (customerId: string) => {
    const cust = customers.find(c => c.id === customerId);
    setSelectedCustomer(cust);
    setFormData(prev => ({ ...prev, customerId }));
  };

  const handleUnlimitedChange = (checked: boolean) => {
    setIsUnlimited(checked);
    setFormData(prev => ({ ...prev, endDate: checked ? null : new Date().toISOString().split('T')[0] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  // Styles
  const inputClass = "w-full bg-slate-950/60 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-all placeholder:text-slate-600";
  const labelClass = "text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 block ml-1";

  return (
    <div className="h-full flex flex-col bg-[#0B0F19] overflow-hidden animate-in fade-in duration-300">
      
      {/* Top Bar */}
      <div className="px-8 py-4 flex items-center justify-between bg-slate-900/40 backdrop-blur-md border-b border-white/5 sticky top-0 z-30">
        <div className="flex items-center gap-4">
            <button onClick={onCancel} className="flex items-center justify-center p-2 rounded-full bg-slate-800/50 hover:bg-slate-700 border border-white/5 hover:border-white/10 text-slate-400 hover:text-white transition-all">
                <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-semibold text-white">
                {rental ? `Vertrag ${rental.contractNumber}` : 'Neuer Mietvertrag'}
            </h1>
        </div>
        <div className="flex gap-3">
            {rental && (
                <button onClick={() => onDelete(rental.id)} className="group flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-400 rounded-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] bg-slate-900/80 backdrop-blur-sm border border-red-500/30 hover:border-red-500/60 hover:shadow-[0_0_20px_rgba(239,68,68,0.15)]">
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
        <div className="max-w-4xl mx-auto space-y-8">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {/* Customer Selection */}
                 <div className="bg-slate-900/40 backdrop-blur-sm border border-white/5 rounded-3xl p-6 shadow-xl col-span-1 md:col-span-2">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <User className="w-5 h-5 text-indigo-400" /> Kunde auswählen
                    </h3>
                    <div className="space-y-4">
                         <div className="relative">
                            <select 
                                value={formData.customerId} 
                                onChange={(e) => handleCustomerChange(e.target.value)}
                                className={`${inputClass} appearance-none`}
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
                                <p className="font-semibold text-white text-base">{selectedCustomer.company || selectedCustomer.name}</p>
                                <p>{selectedCustomer.address}</p>
                            </div>
                        )}
                    </div>
                 </div>

                 {/* Contract Details */}
                 <div className="bg-slate-900/40 backdrop-blur-sm border border-white/5 rounded-3xl p-6 shadow-xl col-span-1 md:col-span-2">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Key className="w-5 h-5 text-indigo-400" /> Vertragsdaten
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className={labelClass}>Vertragsnummer</label>
                            <div className="relative">
                                <Hash className="absolute right-3 top-3 w-4 h-4 text-slate-600" />
                                <input 
                                    type="text" 
                                    value={formData.contractNumber}
                                    onChange={(e) => setFormData(p => ({ ...p, contractNumber: e.target.value }))}
                                    className={inputClass}
                                />
                            </div>
                        </div>

                         <div className="md:col-span-2">
                            <label className={labelClass}>Bezeichnung / Beschreibung</label>
                            <input 
                                type="text" 
                                value={formData.description}
                                onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))}
                                className={inputClass}
                                placeholder="z.B. Monatliche Serverwartung"
                            />
                        </div>

                        <div>
                            <label className={labelClass}>Vertragsbeginn</label>
                             <div className="relative">
                                <Calendar className="absolute right-3 top-3 w-4 h-4 text-slate-600 pointer-events-none" />
                                <input 
                                    type="date" 
                                    value={formData.startDate}
                                    onChange={(e) => setFormData(p => ({ ...p, startDate: e.target.value }))}
                                    className={inputClass}
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1 ml-1">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Vertragsende</label>
                                <label className="flex items-center gap-2 cursor-pointer text-xs text-indigo-300">
                                    <input 
                                        type="checkbox" 
                                        checked={isUnlimited}
                                        onChange={(e) => handleUnlimitedChange(e.target.checked)}
                                        className="rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    Unbefristet
                                </label>
                            </div>
                             <div className="relative">
                                <Calendar className="absolute right-3 top-3 w-4 h-4 text-slate-600 pointer-events-none" />
                                <input 
                                    type="date" 
                                    value={formData.endDate || ''}
                                    onChange={(e) => setFormData(p => ({ ...p, endDate: e.target.value }))}
                                    disabled={isUnlimited}
                                    className={`${inputClass} ${isUnlimited ? 'opacity-50 cursor-not-allowed' : ''}`}
                                />
                            </div>
                        </div>

                        <div>
                            <label className={labelClass}>Monatlicher Mietpreis</label>
                            <div className="relative">
                                <Euro className="absolute right-3 top-3 w-4 h-4 text-slate-600 pointer-events-none" />
                                <input 
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={formData.monthlyPrice}
                                    onChange={(e) => setFormData(p => ({ ...p, monthlyPrice: parseFloat(e.target.value) }))}
                                    className={`${inputClass} font-mono`}
                                />
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
