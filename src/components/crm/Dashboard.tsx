import React, { useMemo } from 'react';
import { Customer, Invoice, Offer, RentalContract, CustomerStatus } from '@/types';
import { 
  Users, 
  TrendingUp, 
  Wallet, 
  FileText, 
  Activity, 
  Crown,
  Key,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock,
  Briefcase
} from 'lucide-react';

interface DashboardProps {
  customers: Customer[];
  invoices: Invoice[];
  offers: Offer[];
  rentals: RentalContract[];
}

export const Dashboard: React.FC<DashboardProps> = ({ customers, invoices, offers, rentals }) => {
  
  const stats = useMemo(() => {
    // --- 1. KUNDEN ---
    const totalCustomers = customers.length;
    const activeCustomers = customers.filter(c => c.status === CustomerStatus.Active).length;
    const inactiveCustomers = customers.filter(c => c.status === CustomerStatus.Inactive || c.status === CustomerStatus.Churned).length;
    const leadCustomers = customers.filter(c => c.status === CustomerStatus.Lead).length;

    // --- 2. FINANZEN (RECHNUNGEN) ---
    const totalRevenue = invoices
      .filter(i => i.status === 'Bezahlt')
      .reduce((acc, i) => acc + i.totalNet, 0);
    
    const openRevenue = invoices
      .filter(i => i.status === 'Offen')
      .reduce((acc, i) => acc + i.totalNet, 0);

    const overdueRevenue = invoices
      .filter(i => i.status === 'Überfällig')
      .reduce((acc, i) => acc + i.totalNet, 0);

    // Top 5 Kunden nach Umsatz
    const customerRevenueMap = new Map<string, number>();
    invoices.forEach(inv => {
        if (inv.status === 'Bezahlt') {
            const current = customerRevenueMap.get(inv.customerId) || 0;
            customerRevenueMap.set(inv.customerId, current + inv.totalNet);
        }
    });

    const topCustomers = customers
        .map(c => ({
            ...c,
            revenue: customerRevenueMap.get(c.id) || 0
        }))
        .filter(c => c.revenue > 0)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

    // --- 3. MIETVERTRÄGE ---
    const activeRentals = rentals.filter(r => !r.endDate || new Date(r.endDate) >= new Date());
    const activeRentalsCount = activeRentals.length;
    const mrr = activeRentals.reduce((acc, r) => acc + r.monthlyPrice, 0);
    const arr = mrr * 12;

    const topRentals = [...activeRentals]
        .sort((a, b) => b.monthlyPrice - a.monthlyPrice)
        .slice(0, 5);

    // --- 4. ANGEBOTE ---
    const totalOffers = offers.length;
    const openOffers = offers.filter(o => o.status === 'Versendet' || o.status === 'Entwurf');
    const openOffersCount = openOffers.length;
    const pipelineValue = openOffers.reduce((acc, o) => acc + o.totalNet, 0);
    const acceptedOffersCount = offers.filter(o => o.status === 'Angenommen').length;
    const winRate = totalOffers ? (acceptedOffersCount / totalOffers) * 100 : 0;

    return {
        // Kunden
        totalCustomers,
        activeCustomers,
        inactiveCustomers,
        leadCustomers,
        // Finanzen
        totalRevenue,
        openRevenue,
        overdueRevenue,
        topCustomers,
        // Mietverträge
        activeRentalsCount,
        mrr,
        arr,
        topRentals,
        // Angebote
        totalOffers,
        openOffersCount,
        pipelineValue,
        winRate
    };
  }, [customers, invoices, offers, rentals]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-full flex flex-col animate-in fade-in duration-500 pb-20">
      
      {/* Header */}
      <div className="mb-6 sm:mb-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 tracking-tight">Dashboard</h1>
        <p className="text-sm sm:text-base text-slate-400">Guten Tag! Hier ist Ihr strukturierter Geschäftsüberblick.</p>
      </div>

      {/* --- SECTION 1: KUNDEN --- */}
      <section className="mb-8 sm:mb-12">
        <div className="flex items-center gap-3 mb-4 sm:mb-6 border-b border-slate-800 pb-4">
            <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                <Users className="w-5 h-5" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white">Kunden</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg">
                <div className="text-slate-500 text-xs sm:text-sm font-medium mb-1">Alle Kunden</div>
                <div className="text-2xl sm:text-3xl font-bold text-white">{stats.totalCustomers}</div>
            </div>
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 hidden sm:block"><CheckCircle2 className="w-16 h-16" /></div>
                <div className="text-emerald-400 text-xs sm:text-sm font-medium mb-1 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Aktiv
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-white">{stats.activeCustomers}</div>
                <div className="text-[10px] sm:text-xs text-slate-500 mt-2 hidden sm:block">Laufende Geschäftsbeziehung</div>
            </div>
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-4 opacity-5 hidden sm:block"><Briefcase className="w-16 h-16" /></div>
                <div className="text-blue-400 text-xs sm:text-sm font-medium mb-1 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span> Interessenten
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-white">{stats.leadCustomers}</div>
                <div className="text-[10px] sm:text-xs text-slate-500 mt-2 hidden sm:block">Potenzielle Neukunden</div>
            </div>
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 hidden sm:block"><XCircle className="w-16 h-16" /></div>
                <div className="text-slate-400 text-xs sm:text-sm font-medium mb-1 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-slate-500"></span> Inaktiv
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-white">{stats.inactiveCustomers}</div>
            </div>
        </div>
      </section>

      {/* --- SECTION 2: RECHNUNGEN & FINANZEN --- */}
      <section className="mb-8 sm:mb-12">
        <div className="flex items-center gap-3 mb-4 sm:mb-6 border-b border-slate-800 pb-4">
            <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400">
                <Wallet className="w-5 h-5" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white">Rechnungen & Finanzen</h2>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-8">
            {/* Left: Financial Stats */}
            <div className="xl:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6">
                
                {/* Total Revenue */}
                <div className="sm:col-span-3 bg-gradient-to-br from-slate-900 to-slate-900 border border-slate-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity hidden sm:block">
                        <TrendingUp className="w-32 h-32 text-emerald-500" />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 text-emerald-400 font-medium mb-2 text-sm">
                            <Activity className="w-4 h-4" /> Gesamtumsatz (Bezahlt)
                        </div>
                        <div className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
                            {stats.totalRevenue.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                        </div>
                        <div className="mt-4 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                             <div className="h-full bg-emerald-500 w-full animate-pulse" style={{ opacity: 0.5 }}></div>
                        </div>
                    </div>
                </div>

                {/* Open & Overdue */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg">
                    <div className="flex items-center gap-2 text-blue-400 font-medium mb-2 text-xs sm:text-sm">
                        <Clock className="w-4 h-4" /> Offene Forderungen
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-white">
                         {stats.openRevenue.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                    </div>
                </div>
                 <div className={`bg-slate-900/50 border rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg ${stats.overdueRevenue > 0 ? 'border-red-500/50 animate-pulse-red' : 'border-slate-800'}`}>
                    <div className="flex items-center gap-2 text-red-400 font-medium mb-2 text-xs sm:text-sm">
                        <AlertCircle className={`w-4 h-4 ${stats.overdueRevenue > 0 ? 'animate-ping-slow' : ''}`} /> Überfällig
                    </div>
                    <div className={`text-xl sm:text-2xl font-bold ${stats.overdueRevenue > 0 ? 'text-red-400' : 'text-white'}`}>
                         {stats.overdueRevenue.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                    </div>
                </div>
                 <div className="bg-slate-900/50 border border-slate-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg flex flex-col justify-center items-center text-center">
                    <div className="text-slate-500 text-xs sm:text-sm mb-1">Rechnungen Gesamt</div>
                    <div className="text-2xl sm:text-3xl font-bold text-white">{invoices.length}</div>
                </div>
            </div>

            {/* Right: Top 5 Customers */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg flex flex-col">
                 <div className="flex items-center gap-2 mb-4 sm:mb-6">
                    <Crown className="w-5 h-5 text-amber-400" />
                    <h3 className="font-bold text-white text-sm sm:text-base">Top 5 Kunden (Umsatz)</h3>
                </div>
                 <div className="flex-1 space-y-2 sm:space-y-3">
                    {stats.topCustomers.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-500 text-sm italic">
                            Keine Umsatzdaten vorhanden.
                        </div>
                    ) : (
                        stats.topCustomers.map((customer, index) => (
                            <div key={customer.id} className="flex items-center justify-between p-2 sm:p-3 rounded-lg sm:rounded-xl bg-slate-950/30 border border-slate-800/50 hover:border-amber-500/30 transition-all">
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                        index === 0 ? 'bg-amber-500 text-slate-900' : 'bg-slate-800 text-slate-500'
                                    }`}>
                                        {index + 1}
                                    </div>
                                    <div className="text-xs sm:text-sm font-medium text-slate-200 truncate max-w-[80px] sm:max-w-[120px]">
                                        {customer.company || customer.name}
                                    </div>
                                </div>
                                <div className="text-xs sm:text-sm font-bold text-white">
                                    {(customer as any).revenue.toLocaleString('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })}
                                </div>
                            </div>
                        ))
                    )}
                 </div>
            </div>
        </div>
      </section>

      {/* --- SECTION 3: MIETVERTRÄGE --- */}
      <section className="mb-8 sm:mb-12">
        <div className="flex items-center gap-3 mb-4 sm:mb-6 border-b border-slate-800 pb-4">
            <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                <Key className="w-5 h-5" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white">Mietverträge (Recurring)</h2>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-8">
            {/* Left: Contract Stats */}
            <div className="grid grid-cols-2 gap-3 sm:gap-6">
                <div className="col-span-2 bg-slate-900/50 border border-slate-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity hidden sm:block">
                        <Activity className="w-24 h-24 text-indigo-500" />
                    </div>
                    <div className="relative z-10">
                         <div className="text-indigo-400 font-medium mb-1 text-xs sm:text-sm flex items-center gap-2">
                             <TrendingUp className="w-4 h-4" /> Monatlicher Umsatz (MRR)
                         </div>
                         <div className="text-2xl sm:text-3xl font-bold text-white">
                            {stats.mrr.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                         </div>
                         <div className="mt-2 sm:mt-4 text-[10px] sm:text-xs text-slate-500">
                            ARR: <span className="text-indigo-300">{stats.arr.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</span>
                         </div>
                    </div>
                </div>

                <div className="bg-slate-900/50 border border-slate-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg">
                    <div className="text-slate-400 text-xs sm:text-sm font-medium mb-1">Aktive Verträge</div>
                    <div className="text-2xl sm:text-3xl font-bold text-white">{stats.activeRentalsCount}</div>
                </div>

                 <div className="bg-slate-900/50 border border-slate-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg">
                    <div className="text-slate-400 text-xs sm:text-sm font-medium mb-1">Durchschn.</div>
                    <div className="text-xl sm:text-3xl font-bold text-white">
                        {stats.activeRentalsCount > 0 
                            ? (stats.mrr / stats.activeRentalsCount).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' }) 
                            : '0 €'}
                    </div>
                </div>
            </div>

            {/* Right: Top 5 Contracts */}
            <div className="xl:col-span-2 bg-slate-900/50 border border-slate-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg flex flex-col">
                 <div className="flex items-center gap-2 mb-4 sm:mb-6">
                    <Key className="w-5 h-5 text-emerald-400" />
                    <h3 className="font-bold text-white text-sm sm:text-base">Top 5 Mietverträge</h3>
                </div>
                 <div className="flex-1 space-y-2 sm:space-y-3">
                    {stats.topRentals.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-500 text-sm italic">
                            Keine aktiven Verträge.
                        </div>
                    ) : (
                        stats.topRentals.map((rental, index) => {
                             const customer = customers.find(c => c.id === rental.customerId);
                             return (
                                <div key={rental.id} className="flex items-center justify-between p-2 sm:p-3 rounded-lg sm:rounded-xl bg-slate-950/30 border border-slate-800/50 hover:border-emerald-500/30 transition-all">
                                    <div className="flex items-center gap-2 sm:gap-3">
                                         <div className="p-2 bg-slate-800 rounded text-slate-400 hidden sm:block">
                                            <Key className="w-4 h-4" />
                                        </div>
                                        <div className="min-w-0">
                                            <div className="text-xs sm:text-sm font-medium text-white truncate max-w-[100px] sm:max-w-[200px]">{rental.description}</div>
                                            <div className="text-[10px] sm:text-xs text-slate-500 truncate">{customer ? (customer.company || customer.name) : 'Unbekannt'}</div>
                                        </div>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <div className="text-xs sm:text-sm font-bold text-emerald-400 font-mono">
                                            {rental.monthlyPrice.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                                        </div>
                                        <div className="text-[10px] text-slate-500">mtl.</div>
                                    </div>
                                </div>
                             );
                        })
                    )}
                 </div>
            </div>
        </div>
      </section>

      {/* --- SECTION 4: ANGEBOTE --- */}
      <section className="mb-8">
        <div className="flex items-center gap-3 mb-4 sm:mb-6 border-b border-slate-800 pb-4">
            <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white">Angebote (Pipeline)</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
             <div className="bg-slate-900/50 border border-slate-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg">
                <div className="text-slate-500 text-xs sm:text-sm font-medium mb-1">Angebote Gesamt</div>
                <div className="text-2xl sm:text-3xl font-bold text-white">{stats.totalOffers}</div>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg">
                <div className="text-blue-400 text-xs sm:text-sm font-medium mb-1">Offene Angebote</div>
                <div className="text-2xl sm:text-3xl font-bold text-white">{stats.openOffersCount}</div>
                <div className="text-[10px] sm:text-xs text-slate-500 mt-2 hidden sm:block">Warten auf Entscheidung</div>
            </div>

             <div className="bg-slate-900/50 border border-slate-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity hidden sm:block">
                     <Wallet className="w-16 h-16 text-blue-500" />
                 </div>
                <div className="text-slate-400 text-xs sm:text-sm font-medium mb-1">Pipeline</div>
                <div className="text-lg sm:text-2xl font-bold text-white truncate">
                    {stats.pipelineValue.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                </div>
                <div className="text-[10px] sm:text-xs text-slate-500 mt-2 hidden sm:block">Potenzieller Umsatz</div>
            </div>

             <div className="bg-slate-900/50 border border-slate-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg">
                <div className="text-emerald-400 text-xs sm:text-sm font-medium mb-1">Abschlussquote</div>
                <div className="text-2xl sm:text-3xl font-bold text-white">{stats.winRate.toFixed(0)}%</div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2">
                    <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${stats.winRate}%` }}></div>
                </div>
            </div>
        </div>
      </section>

    </div>
  );
};
