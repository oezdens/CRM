import React, { useState, useEffect } from 'react';
import { Customer, CustomerStatus, Invoice, Offer, RentalContract } from '@/types';
import { ArrowLeft, Save, User, Building2, MapPin, Phone, Mail, FileText, Hash, Trash2, FileSpreadsheet, Key } from 'lucide-react';

interface CustomerEditorProps {
  customer?: Customer | null;
  invoices: Invoice[];
  offers: Offer[];
  rentals: RentalContract[];
  onSave: (customer: Customer) => void;
  onDelete: (id: string) => void;
  onCancel: () => void;
}

export const CustomerEditor: React.FC<CustomerEditorProps> = ({ 
    customer, 
    invoices,
    offers,
    rentals,
    onSave, 
    onDelete, 
    onCancel 
}) => {
  const [formData, setFormData] = useState<Customer>({
    id: '',
    customerNumber: '',
    name: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    notes: '',
    status: CustomerStatus.Lead,
  });

  useEffect(() => {
    if (customer) {
      setFormData(customer);
    } else {
      setFormData(prev => ({
        ...prev,
        id: crypto.randomUUID(),
        customerNumber: `KD-${Math.floor(1000 + Math.random() * 9000)}`
      }));
    }
  }, [customer]);

  const handleChange = (field: keyof Customer, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const getInitials = (name: string) => {
    return name ? name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() : '??';
  };

  // Filter linked data
  const customerOffers = offers
    .filter(o => o.customerId === customer?.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5); // Show last 5

  const customerInvoices = invoices
    .filter(i => i.customerId === customer?.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5); // Show last 5

  const customerRentals = rentals
    .filter(r => r.customerId === customer?.id);

  // Helper for status colors
  const getInvoiceStatusColor = (status: string) => {
      switch (status) {
          case 'Bezahlt': return 'bg-emerald-500/20 text-emerald-400';
          case 'Offen': return 'bg-blue-500/20 text-blue-400';
          case 'Überfällig': return 'bg-red-500/20 text-red-400';
          default: return 'bg-slate-700 text-slate-400';
      }
  };

  const getOfferStatusColor = (status: string) => {
      switch (status) {
          case 'Angenommen': return 'bg-emerald-500/20 text-emerald-400';
          case 'Versendet': return 'bg-blue-500/20 text-blue-400';
          default: return 'bg-slate-700 text-slate-400';
      }
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
                {customer ? 'Kunde bearbeiten' : 'Neuer Kunde'}
            </h1>
        </div>
        <div className="flex gap-3">
             {customer && (
                <button 
                    onClick={() => onDelete(customer.id)}
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
        <div className="absolute bottom-0 right-0 w-1/3 h-full bg-violet-600/5 blur-[100px] pointer-events-none"></div>

        <div className="h-full overflow-y-auto custom-scrollbar">
            <div className="max-w-7xl mx-auto p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left Column: Profile Card */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="sticky top-8">
                        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl overflow-hidden relative group">
                            <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 to-transparent opacity-50"></div>
                            
                            {/* Profile Content - Left Aligned */}
                            <div className="relative z-10 flex flex-col items-start text-left">
                                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-[0_10px_40px_rgba(99,102,241,0.4)] flex items-center justify-center mb-6 border-2 border-slate-900 transform transition-transform group-hover:scale-105 duration-500">
                                    <span className="text-3xl font-bold text-white tracking-widest">{getInitials(formData.name)}</span>
                                </div>
                                
                                <h2 className="text-2xl font-bold text-white mb-1 break-words w-full">
                                    {formData.name || <span className="text-slate-600 italic">Neuer Kunde</span>}
                                </h2>
                                <p className="text-indigo-400 font-medium mb-6">
                                    {formData.company || 'Firma angeben'}
                                </p>

                                {/* Status Selector Styled as Badge */}
                                <div className="w-full bg-slate-950/50 rounded-2xl p-3 border border-white/5">
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest block mb-3">Status</label>
                                    <div className="flex flex-col gap-2">
                                        {Object.values(CustomerStatus).map((status) => (
                                            <button
                                                key={status}
                                                type="button"
                                                onClick={() => handleChange('status', status)}
                                                className={`w-full text-left py-2 px-3 text-sm font-medium rounded-xl transition-all border flex items-center justify-between ${
                                                    formData.status === status
                                                        ? 'bg-indigo-600/20 border-indigo-500/50 text-indigo-300'
                                                        : 'bg-transparent border-transparent text-slate-400 hover:bg-white/5 hover:text-white'
                                                }`}
                                            >
                                                <span>{status}</span>
                                                {formData.status === status && <div className="w-2 h-2 rounded-full bg-indigo-400 shadow-[0_0_10px_rgba(129,140,248,0.8)]"></div>}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-6 w-full pt-6 border-t border-white/5">
                                    <div className="flex items-center justify-between text-sm text-slate-400">
                                        <span>Kundennummer</span>
                                        <span className="text-white font-mono bg-slate-800/50 px-2 py-1 rounded-md">{formData.customerNumber}</span>
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
                            <div className="p-3 bg-indigo-500/20 rounded-2xl text-indigo-400">
                                <User className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">Allgemeine Informationen</h3>
                                <p className="text-slate-400 text-sm">Grundlegende Kontaktdaten</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2 group">
                                <label className="text-xs font-semibold text-indigo-300 uppercase tracking-widest ml-1">Vollständiger Name</label>
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        value={formData.name}
                                        onChange={(e) => handleChange('name', e.target.value)}
                                        className="w-full bg-slate-950/60 border border-slate-700/50 rounded-xl px-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all hover:bg-slate-950"
                                        placeholder="Max Mustermann"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-indigo-300 uppercase tracking-widest ml-1">Firma</label>
                                <div className="relative">
                                    <Building2 className="absolute right-4 top-3.5 w-5 h-5 text-slate-600 pointer-events-none" />
                                    <input 
                                        type="text" 
                                        value={formData.company}
                                        onChange={(e) => handleChange('company', e.target.value)}
                                        className="w-full bg-slate-950/60 border border-slate-700/50 rounded-xl px-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all hover:bg-slate-950"
                                        placeholder="Musterfirma GmbH"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-indigo-300 uppercase tracking-widest ml-1">E-Mail Adresse</label>
                                <div className="relative">
                                    <Mail className="absolute right-4 top-3.5 w-5 h-5 text-slate-600 pointer-events-none" />
                                    <input 
                                        type="email" 
                                        value={formData.email}
                                        onChange={(e) => handleChange('email', e.target.value)}
                                        className="w-full bg-slate-950/60 border border-slate-700/50 rounded-xl px-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all hover:bg-slate-950"
                                        placeholder="max@firma.de"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-indigo-300 uppercase tracking-widest ml-1">Telefonnummer</label>
                                <div className="relative">
                                    <Phone className="absolute right-4 top-3.5 w-5 h-5 text-slate-600 pointer-events-none" />
                                    <input 
                                        type="tel" 
                                        value={formData.phone}
                                        onChange={(e) => handleChange('phone', e.target.value)}
                                        className="w-full bg-slate-950/60 border border-slate-700/50 rounded-xl px-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all hover:bg-slate-950"
                                        placeholder="+49 170 1234567"
                                    />
                                </div>
                            </div>

                            <div className="md:col-span-2 space-y-2">
                                <label className="text-xs font-semibold text-indigo-300 uppercase tracking-widest ml-1">Kundennummer (Manuell)</label>
                                <div className="relative">
                                    <Hash className="absolute right-4 top-3.5 w-5 h-5 text-slate-600 pointer-events-none" />
                                    <input 
                                        type="text" 
                                        value={formData.customerNumber}
                                        onChange={(e) => handleChange('customerNumber', e.target.value)}
                                        className="w-full bg-slate-950/60 border border-slate-700/50 rounded-xl px-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all hover:bg-slate-950 font-mono"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Address & Notes Card */}
                    <div className="bg-slate-900/40 backdrop-blur-sm border border-white/5 rounded-3xl p-8 shadow-xl">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-3 bg-indigo-500/20 rounded-2xl text-indigo-400">
                                <MapPin className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">Standort & Details</h3>
                                <p className="text-slate-400 text-sm">Adresse und interne Notizen</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-indigo-300 uppercase tracking-widest ml-1">Vollständige Adresse</label>
                                <input 
                                    type="text" 
                                    value={formData.address}
                                    onChange={(e) => handleChange('address', e.target.value)}
                                    className="w-full bg-slate-950/60 border border-slate-700/50 rounded-xl px-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all hover:bg-slate-950"
                                    placeholder="Straße, PLZ, Stadt"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-indigo-300 uppercase tracking-widest ml-1">Interne Notizen</label>
                                <div className="relative">
                                    <FileText className="absolute right-4 top-4 w-5 h-5 text-slate-600 pointer-events-none" />
                                    <textarea
                                        value={formData.notes}
                                        onChange={(e) => handleChange('notes', e.target.value)}
                                        rows={5}
                                        className="w-full bg-slate-950/60 border border-slate-700/50 rounded-xl px-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all hover:bg-slate-950 resize-none"
                                        placeholder="Wichtige Informationen über den Kunden..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* NEW SECTIONS: Only linked if customer exists */}
                    {customer && (
                        <>
                             {/* Mietverträge */}
                             <div className="bg-slate-900/40 backdrop-blur-sm border border-white/5 rounded-3xl p-8 shadow-xl">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-3 bg-indigo-500/20 rounded-2xl text-indigo-400">
                                        <Key className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white">Mietverträge</h3>
                                </div>

                                {customerRentals.length === 0 ? (
                                    <div className="text-center py-6 text-slate-500 text-sm italic">
                                        Keine aktiven Mietverträge.
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {customerRentals.map(rental => (
                                            <div key={rental.id} className="bg-slate-950/50 rounded-xl p-4 border border-white/5 flex justify-between items-center group hover:border-indigo-500/30 transition-all">
                                                <div>
                                                    <div className="text-white font-medium">{rental.description}</div>
                                                    <div className="text-xs text-slate-500 font-mono mt-1">{rental.contractNumber}</div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-emerald-400 font-bold font-mono">
                                                        {rental.monthlyPrice.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                                                    </div>
                                                    <span className="text-xs text-slate-500">monatlich</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                             </div>

                             {/* Letzte Angebote */}
                             <div className="bg-slate-900/40 backdrop-blur-sm border border-white/5 rounded-3xl p-8 shadow-xl">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-3 bg-indigo-500/20 rounded-2xl text-indigo-400">
                                        <FileSpreadsheet className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white">Letzte Angebote</h3>
                                </div>

                                {customerOffers.length === 0 ? (
                                    <div className="text-center py-6 text-slate-500 text-sm italic">
                                        Noch keine Angebote.
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {customerOffers.map(offer => (
                                            <div key={offer.id} className="bg-slate-950/50 rounded-xl p-4 border border-white/5 flex justify-between items-center group hover:border-indigo-500/30 transition-all">
                                                <div>
                                                    <div className="text-white font-mono font-medium text-sm">{offer.offerNumber}</div>
                                                    <div className="text-xs text-slate-500 mt-1">{offer.project || 'Kein Projekt'}</div>
                                                </div>
                                                <div className="flex flex-col items-end gap-1">
                                                     <div className="text-white font-bold text-sm">
                                                        {offer.totalNet.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
                                                    </div>
                                                    <span className={`px-2 py-0.5 rounded-md text-[10px] uppercase font-bold tracking-wider ${getOfferStatusColor(offer.status)}`}>
                                                        {offer.status}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                             </div>

                             {/* Letzte Rechnungen */}
                             <div className="bg-slate-900/40 backdrop-blur-sm border border-white/5 rounded-3xl p-8 shadow-xl">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-3 bg-indigo-500/20 rounded-2xl text-indigo-400">
                                        <FileText className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white">Letzte Rechnungen</h3>
                                </div>

                                {customerInvoices.length === 0 ? (
                                    <div className="text-center py-6 text-slate-500 text-sm italic">
                                        Noch keine Rechnungen.
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {customerInvoices.map(invoice => (
                                            <div key={invoice.id} className="bg-slate-950/50 rounded-xl p-4 border border-white/5 flex justify-between items-center group hover:border-indigo-500/30 transition-all">
                                                <div>
                                                    <div className="text-white font-mono font-medium text-sm">{invoice.invoiceNumber}</div>
                                                    <div className="text-xs text-slate-500 mt-1">{new Date(invoice.date).toLocaleDateString('de-DE')}</div>
                                                </div>
                                                <div className="flex flex-col items-end gap-1">
                                                     <div className="text-white font-bold text-sm">
                                                        {invoice.totalNet.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
                                                    </div>
                                                    <span className={`px-2 py-0.5 rounded-md text-[10px] uppercase font-bold tracking-wider ${getInvoiceStatusColor(invoice.status)}`}>
                                                        {invoice.status}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                             </div>
                        </>
                    )}

                </div>
            </div>
        </div>
      </div>
    </div>
  );
};