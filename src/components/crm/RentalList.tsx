import React, { useState, useMemo } from 'react';
import { RentalContract, Customer } from '@/types';
import { Plus, Search, Calendar, List, CheckCircle2, XCircle, ChevronLeft, ChevronRight, Key, Trash2, Pencil, Filter, TrendingUp, CalendarRange, Wallet } from 'lucide-react';

interface RentalListProps {
  rentals: RentalContract[];
  customers: Customer[];
  onAddRental: () => void;
  onEditRental: (rental: RentalContract) => void;
  onDeleteRental: (id: string) => void;
  onUpdatePaymentStatus: (rentalId: string, monthKey: string, status: 'Paid' | 'Open') => void;
}

export const RentalList: React.FC<RentalListProps> = ({ 
  rentals, 
  customers,
  onAddRental, 
  onEditRental,
  onDeleteRental,
  onUpdatePaymentStatus
}) => {
  const [viewMode, setViewMode] = useState<'list' | 'matrix'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'ENDED'>('ALL');
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  // --- Statistics Calculation ---
  const stats = useMemo(() => {
    const totalContracts = rentals.length;
    const now = new Date();
    
    // Active contracts: No end date OR end date is in future
    const activeContracts = rentals.filter(r => !r.endDate || new Date(r.endDate) >= now);
    const activeCount = activeContracts.length;

    // Monthly Recurring Revenue (MRR)
    const mrr = activeContracts.reduce((acc, r) => acc + r.monthlyPrice, 0);
    
    // Annual Run Rate (ARR)
    const arr = mrr * 12;

    // Payment status for current month
    const currentMonthKey = `${currentYear}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}`;
    const paidCountCurrentMonth = activeContracts.filter(r => r.payments[currentMonthKey] === 'Paid').length;
    const paidPercent = activeCount ? (paidCountCurrentMonth / activeCount) * 100 : 0;

    return {
        totalContracts,
        activeCount,
        mrr,
        arr,
        paidCountCurrentMonth,
        paidPercent
    };
  }, [rentals, currentYear]);

  const getCustomerName = (id: string) => {
    const customer = customers.find(c => c.id === id);
    return customer ? (customer.company || customer.name) : 'Unbekannter Kunde';
  };

  const filteredRentals = rentals.filter(r => {
    const matchesSearch = r.contractNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getCustomerName(r.customerId).toLowerCase().includes(searchTerm.toLowerCase());

    let matchesFilter = true;
    const now = new Date();
    const isActive = !r.endDate || new Date(r.endDate) >= now;

    if (statusFilter === 'ACTIVE') matchesFilter = isActive;
    if (statusFilter === 'ENDED') matchesFilter = !isActive;

    return matchesSearch && matchesFilter;
  });

  const months = [
    { num: '01', name: 'Jan' }, { num: '02', name: 'Feb' }, { num: '03', name: 'Mär' },
    { num: '04', name: 'Apr' }, { num: '05', name: 'Mai' }, { num: '06', name: 'Jun' },
    { num: '07', name: 'Jul' }, { num: '08', name: 'Aug' }, { num: '09', name: 'Sep' },
    { num: '10', name: 'Okt' }, { num: '11', name: 'Nov' }, { num: '12', name: 'Dez' }
  ];

  const togglePayment = (rental: RentalContract, monthNum: string) => {
    const key = `${currentYear}-${monthNum}`;
    const currentStatus = rental.payments[key] || 'Open';
    const newStatus = currentStatus === 'Paid' ? 'Open' : 'Paid';
    onUpdatePaymentStatus(rental.id, key, newStatus);
  };

  const isMonthInContract = (rental: RentalContract, monthNum: string) => {
    const monthDate = new Date(`${currentYear}-${monthNum}-01`);
    const startDate = new Date(rental.startDate);
    // Set start date to first of month to avoid day discrepancies for simple month check
    startDate.setDate(1); 

    if (monthDate < startDate) return false;
    
    if (rental.endDate) {
      const endDate = new Date(rental.endDate);
      if (monthDate > endDate) return false;
    }
    return true;
  };

  return (
    <div className="p-8 min-h-full flex flex-col animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between lg:items-end gap-4 mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2 tracking-tight">Mietverträge</h1>
          <p className="text-slate-400 text-sm lg:text-base">Verwalten Sie wiederkehrende Zahlungen und Verträge.</p>
        </div>
        <div className="flex flex-wrap gap-3">
            <div className="bg-slate-900 border border-slate-800 p-1 rounded-xl flex gap-1">
                <button 
                    onClick={() => setViewMode('list')}
                    className={`px-3 lg:px-4 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${viewMode === 'list' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                >
                    <List className="w-4 h-4" /> <span className="hidden sm:inline">Liste</span>
                </button>
                <button 
                    onClick={() => setViewMode('matrix')}
                    className={`px-3 lg:px-4 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${viewMode === 'matrix' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                >
                    <Calendar className="w-4 h-4" /> <span className="hidden sm:inline">Zahlungsmatrix</span>
                </button>
            </div>
            <button 
                onClick={onAddRental}
                className="group flex items-center gap-2 px-3 lg:px-4 py-2 text-sm font-medium text-white rounded-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 hover:border-indigo-500/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)]"
            >
                <Plus className="w-4 h-4 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
                <span className="hidden sm:inline">Vertrag erstellen</span>
            </button>
        </div>
      </div>

       {/* DASHBOARD STATS */}
       <div className="mb-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {/* Active Contracts */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 shadow-lg">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-slate-800 rounded-lg text-slate-400">
                        <Key className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Aktive Verträge</span>
                </div>
                <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-2xl font-bold text-white">{stats.activeCount}</span>
                    <span className="text-sm text-slate-400">/ {stats.totalContracts} Gesamt</span>
                </div>
                 <div className="w-full bg-slate-800 rounded-full h-1.5 mb-2">
                    <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${(stats.activeCount / stats.totalContracts) * 100}%` }}></div>
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                    <span>Laufende Verträge</span>
                </div>
            </div>

            {/* MRR (Monthly) */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                     <TrendingUp className="w-16 h-16 text-emerald-500" />
                 </div>
                <div className="flex flex-col mb-4 relative z-10">
                    <span className="text-xs font-semibold text-emerald-400/80 uppercase tracking-wider mb-1">Monatlicher Umsatz (MRR)</span>
                    <span className="text-2xl font-bold text-white tracking-tight">
                        {stats.mrr.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                    </span>
                </div>
                 <div className="flex items-center gap-2 text-xs text-slate-400 relative z-10">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    <span>Basierend auf aktiven Verträgen</span>
                </div>
            </div>

             {/* ARR (Yearly) */}
             <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                     <CalendarRange className="w-16 h-16 text-indigo-500" />
                 </div>
                <div className="flex flex-col mb-4 relative z-10">
                    <span className="text-xs font-semibold text-indigo-400/80 uppercase tracking-wider mb-1">Jahresprognose (ARR)</span>
                    <span className="text-2xl font-bold text-white tracking-tight">
                        {stats.arr.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                    </span>
                </div>
                 <div className="flex items-center gap-2 text-xs text-slate-400 relative z-10">
                    <TrendingUp className="w-3 h-3 text-indigo-500" />
                    <span>Hochrechnung (MRR x 12)</span>
                </div>
            </div>

            {/* Payment Status (Current Month) */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 shadow-lg">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                        <Wallet className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-semibold text-blue-400/80 uppercase tracking-wider">Zahlungen (Aktuell)</span>
                </div>
                <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-2xl font-bold text-white">{stats.paidCountCurrentMonth}</span>
                    <span className="text-sm text-slate-400">/ {stats.activeCount} Bezahlt</span>
                </div>
                 <div className="w-full bg-slate-800 rounded-full h-1.5 mb-2">
                    <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${stats.paidPercent}%` }}></div>
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                    <span>Dieser Monat</span>
                    <span>{stats.paidPercent.toFixed(0)}%</span>
                </div>
            </div>
       </div>

      {/* View Content */}
      {viewMode === 'list' ? (
        <>
            <div className="flex gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                    <input 
                        type="text"
                        placeholder="Suche nach Kunde, Vertragsnr..."
                        className="w-full bg-slate-900/50 border border-slate-800 rounded-lg py-2 pl-9 pr-4 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all placeholder:text-slate-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="relative">
                    <Filter className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 pointer-events-none" />
                    <select 
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as 'ALL' | 'ACTIVE' | 'ENDED')}
                        className="appearance-none bg-slate-900/50 text-sm text-slate-300 border border-slate-800 rounded-lg py-2 pl-9 pr-8 hover:bg-slate-800 hover:text-white transition-all focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50 cursor-pointer min-w-[160px]"
                    >
                        <option value="ALL">Alle Verträge</option>
                        <option value="ACTIVE">Nur Aktive</option>
                        <option value="ENDED">Beendete</option>
                    </select>
                    <div className="absolute right-3 top-3 w-2 h-2 border-r-2 border-b-2 border-slate-500 rotate-45 pointer-events-none"></div>
                </div>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
                <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-slate-900 z-10 shadow-sm border-b border-slate-800">
                    <tr>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Vertragsnr.</th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Kunde</th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Bezeichnung</th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Laufzeit</th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Monatlich</th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Aktionen</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                    {filteredRentals.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="px-6 py-32 text-center text-slate-500">
                                <div className="flex flex-col items-center justify-center gap-4">
                                    <div className="w-20 h-20 rounded-full bg-slate-800/50 flex items-center justify-center border border-slate-800">
                                        <Key className="w-8 h-8 text-slate-600" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-lg font-medium text-slate-300">Keine Verträge gefunden</p>
                                        <p className="text-sm">Passen Sie den Filter an oder erstellen Sie einen neuen Vertrag.</p>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    ) : (
                        filteredRentals.map((rental) => (
                        <tr 
                            key={rental.id} 
                            className="group hover:bg-slate-800/40 transition-all border-l-2 border-transparent hover:border-indigo-500"
                        >
                            <td className="px-6 py-4 text-white font-mono text-sm font-medium">
                                {rental.contractNumber}
                            </td>
                            <td className="px-6 py-4">
                                <div className="font-medium text-slate-200">{getCustomerName(rental.customerId)}</div>
                            </td>
                            <td className="px-6 py-4 text-slate-400 text-sm">
                                {rental.description}
                            </td>
                            <td className="px-6 py-4 text-slate-400 text-sm">
                                {new Date(rental.startDate).toLocaleDateString('de-DE')} - {rental.endDate ? new Date(rental.endDate).toLocaleDateString('de-DE') : 'Unbefristet'}
                            </td>
                            <td className="px-6 py-4 text-right font-bold text-emerald-400 font-mono">
                                {rental.monthlyPrice.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center justify-end gap-2">
                                     <button 
                                        onClick={() => onEditRental(rental)}
                                        className="p-2 text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-all"
                                        title="Bearbeiten"
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </button>
                                    <button 
                                        onClick={() => onDeleteRental(rental.id)}
                                        className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                        title="Löschen"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                        ))
                    )}
                    </tbody>
                </table>
                </div>
            </div>
        </>
      ) : (
        // Matrix View
        <div className="flex flex-col h-full gap-4">
            <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 mb-2">
                 <div className="flex items-center gap-4 bg-slate-900/50 p-2 rounded-xl border border-slate-800 w-fit">
                    <button 
                        onClick={() => setCurrentYear(p => p - 1)}
                        className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-xl font-bold text-white font-mono w-20 text-center">{currentYear}</span>
                    <button 
                        onClick={() => setCurrentYear(p => p + 1)}
                        className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                 </div>
                 
                 {/* Also added filter to matrix view for consistency */}
                 <div className="flex flex-wrap items-center gap-3 lg:gap-4">
                     <div className="relative">
                        <select 
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as 'ALL' | 'ACTIVE' | 'ENDED')}
                            className="appearance-none bg-slate-900/50 text-slate-300 border border-slate-800 rounded-xl py-1.5 pl-3 pr-8 text-sm hover:bg-slate-800 hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer"
                        >
                            <option value="ALL">Alle</option>
                            <option value="ACTIVE">Aktive</option>
                            <option value="ENDED">Beendete</option>
                        </select>
                         <div className="absolute right-2 top-2.5 w-2 h-2 border-r-2 border-b-2 border-slate-500 rotate-45 pointer-events-none"></div>
                    </div>

                    <div className="flex flex-wrap gap-2 lg:gap-4 text-xs lg:text-sm">
                        <div className="flex items-center gap-1.5 lg:gap-2">
                            <div className="w-2.5 h-2.5 lg:w-3 lg:h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                            <span className="text-slate-300">Bezahlt</span>
                        </div>
                        <div className="flex items-center gap-1.5 lg:gap-2">
                            <div className="w-2.5 h-2.5 lg:w-3 lg:h-3 rounded-full bg-red-500/20 border border-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
                            <span className="text-slate-300 hidden sm:inline">Offen / Nicht bezahlt</span>
                            <span className="text-slate-300 sm:hidden">Offen</span>
                        </div>
                        <div className="flex items-center gap-1.5 lg:gap-2">
                            <div className="w-2.5 h-2.5 lg:w-3 lg:h-3 rounded-full bg-slate-900 border border-dashed border-slate-700"></div>
                            <span className="text-slate-500">Nicht aktiv</span>
                        </div>
                    </div>
                 </div>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
                <div className="overflow-x-auto">
                     <table className="w-full text-left border-collapse">
                        <thead className="sticky top-0 bg-slate-900 z-10 shadow-sm border-b border-slate-800">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider min-w-[200px] sticky left-0 bg-slate-900 z-20 border-r border-slate-800">Kunde / Vertrag</th>
                                {months.map(m => (
                                    <th key={m.num} className="px-2 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center w-20 border-r border-slate-800/50 last:border-r-0">
                                        {m.name}
                                    </th>
                                ))}
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider w-20"></th>
                            </tr>
                        </thead>
                         <tbody className="divide-y divide-slate-800/50">
                            {filteredRentals.map(rental => (
                                <tr key={rental.id} className="hover:bg-slate-800/40">
                                    <td className="px-6 py-4 sticky left-0 bg-slate-900/95 z-10 border-r border-slate-800 group">
                                         <div className="font-medium text-slate-200">{getCustomerName(rental.customerId)}</div>
                                         <div className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                                            <span>{rental.contractNumber}</span>
                                            <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                                            <span>{rental.monthlyPrice.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</span>
                                         </div>
                                    </td>
                                    {months.map(m => {
                                        const isActive = isMonthInContract(rental, m.num);
                                        const isPaid = rental.payments[`${currentYear}-${m.num}`] === 'Paid';
                                        
                                        return (
                                            <td key={m.num} className="p-2 text-center border-r border-slate-800/50 last:border-r-0">
                                                {isActive ? (
                                                    <button 
                                                        onClick={() => togglePayment(rental, m.num)}
                                                        className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                                                            isPaid 
                                                            ? 'bg-emerald-500 text-white shadow-[0_0_10px_rgba(16,185,129,0.4)] hover:bg-emerald-400' 
                                                            : 'bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.1)] hover:border-red-500/50'
                                                        }`}
                                                        title={isPaid ? "Als unbezahlt markieren" : "Als bezahlt markieren"}
                                                    >
                                                        {isPaid ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5 opacity-70" />}
                                                    </button>
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center opacity-20">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-600"></div>
                                                    </div>
                                                )}
                                            </td>
                                        );
                                    })}
                                    <td className="px-6 py-4 text-right">
                                         <button 
                                            onClick={() => onEditRental(rental)}
                                            className="text-slate-500 hover:text-indigo-400 transition-colors"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                         </tbody>
                     </table>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};
