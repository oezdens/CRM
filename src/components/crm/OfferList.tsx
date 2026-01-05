import React, { useState, useMemo } from 'react';
import { Offer, Customer, OfferStatus } from '@/types';
import { Plus, Search, Filter, Copy, Pencil, Trash2, FileSpreadsheet, Download, CheckCircle2, XCircle, Send, PieChart, Euro, TrendingUp, Archive } from 'lucide-react';
import LogoOezdens from '@/Bilder/Logo_oezdens.png';

interface OfferListProps {
  offers: Offer[];
  customers: Customer[];
  onAddOffer: () => void;
  onEditOffer: (offer: Offer) => void;
  onDeleteOffer: (id: string) => void;
  onDuplicateOffer: (offer: Offer) => void;
}

export const OfferList: React.FC<OfferListProps> = ({ 
  offers, 
  customers,
  onAddOffer, 
  onEditOffer,
  onDeleteOffer,
  onDuplicateOffer
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<OfferStatus | 'ALL'>('ALL');

  // --- Statistics Calculation ---
  const stats = useMemo(() => {
    const totalCount = offers.length;
    const acceptedCount = offers.filter(o => o.status === 'Angenommen').length;
    const sentCount = offers.filter(o => o.status === 'Versendet').length;
    const rejectedCount = offers.filter(o => o.status === 'Abgelehnt').length;

    const totalSum = offers.reduce((acc, o) => acc + o.totalNet, 0);
    const wonSum = offers.filter(o => o.status === 'Angenommen').reduce((acc, o) => acc + o.totalNet, 0);
    const pipelineSum = offers.filter(o => ['Versendet', 'Entwurf'].includes(o.status)).reduce((acc, o) => acc + o.totalNet, 0);

    return {
        totalCount,
        acceptedCount,
        sentCount,
        rejectedCount,
        totalSum,
        wonSum,
        pipelineSum,
        // Percentages
        acceptedPercent: totalCount ? (acceptedCount / totalCount) * 100 : 0,
        sentPercent: totalCount ? (sentCount / totalCount) * 100 : 0,
        rejectedPercent: totalCount ? (rejectedCount / totalCount) * 100 : 0,
        wonSumPercent: totalSum ? (wonSum / totalSum) * 100 : 0,
        pipelineSumPercent: totalSum ? (pipelineSum / totalSum) * 100 : 0,
    };
  }, [offers]);

  const getCustomerName = (offer: Offer) => {
    // Priority: Snapshot name -> Linked customer name -> Unknown
    if (offer.customerNameSnapshot) return offer.customerNameSnapshot;
    const customer = customers.find(c => c.id === offer.customerId);
    return customer ? (customer.company || customer.name) : 'Unbekannter Kunde';
  };

  const getStatusColor = (status: OfferStatus) => {
    switch (status) {
      case 'Angenommen': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Versendet': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Abgelehnt': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'Entwurf': return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  const filteredOffers = offers.filter(off => {
    const matchesSearch = off.offerNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    off.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getCustomerName(off).toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = statusFilter === 'ALL' || off.status === statusFilter;

    return matchesSearch && matchesFilter;
  });

  const handleDownloadPDF = (offer: Offer) => {
    const customer = customers.find(c => c.id === offer.customerId);
    const customerName = offer.customerNameSnapshot || (customer ? (customer.company ? `${customer.company}<br>${customer.name}` : customer.name) : 'Unbekannter Kunde');
    const customerAddress = offer.customerAddressSnapshot || (customer ? customer.address.replace(/\n/g, '<br>') : '');

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Angebot ${offer.offerNumber}</title>
        <style>
          @page { size: A4; margin: 0; }
          * { margin: 0; padding: 0; box-sizing: border-box; }
          html, body { height: 100%; }
          body { 
            font-family: 'Helvetica', 'Arial', sans-serif; 
            color: #333; 
            height: 100%;
            display: flex;
            flex-direction: column;
          }
          .page-wrapper {
            min-height: 100vh;
            width: 100%;
            display: flex;
            flex-direction: column;
            padding: 60px 50px 40px 50px;
          }
          .content { flex: 1; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; border-bottom: 2px solid #eee; padding-bottom: 20px; }
          .header-left { }
          .header-logo { width: 80px; height: auto; }
          .logo { font-size: 24px; font-weight: bold; color: #4f46e5; margin-bottom: 8px; }
          .sender-address { font-size: 12px; color: #666; line-height: 1.5; }
          .recipient { margin-bottom: 40px; font-size: 14px; line-height: 1.6; }
          .meta-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 30px; background: #f9fafb; padding: 20px; border-radius: 8px; }
          .meta-item label { display: block; font-size: 11px; text-transform: uppercase; color: #666; margin-bottom: 4px; }
          .meta-item span { font-weight: 600; font-size: 14px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          th { text-align: left; border-bottom: 2px solid #eee; padding: 12px 8px; font-size: 12px; text-transform: uppercase; color: #666; }
          td { padding: 12px 8px; border-bottom: 1px solid #eee; font-size: 14px; }
          .text-right { text-align: right; }
          .totals { margin-left: auto; width: 300px; margin-bottom: 30px; }
          .total-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px; }
          .grand-total { border-top: 2px solid #333; padding-top: 8px; font-weight: bold; font-size: 18px; }
          .notes-section { margin-top: 20px; font-size: 12px; line-height: 1.8; color: #333; }
          .pre-footer {
            margin-top: auto;
            margin-bottom: 3cm;
            text-align: left;
            font-size: 12px;
            color: #666;
            padding-bottom: 15px;
            line-height: 1.6;
          }
          .footer { 
            border-top: 1px solid #eee; 
            padding-top: 15px; 
            text-align: center; 
            font-size: 10px; 
            color: #666; 
          }
          @media print {
            body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
          }
        </style>
      </head>
      <body>
        <div class="page-wrapper">
          <div class="content">
            <div class="header">
              <div class="header-left">
                <div class="logo">oezdensweb</div>
                <div class="sender-address">
                  Inh. Serhat Özden<br>
                  Bodemstall 6<br>
                  74177 Bad Friedrichshall<br>
                  Deutschland
                </div>
              </div>
              <div style="text-align: right;">
                <img src="${LogoOezdens}" alt="Logo" class="header-logo" />
                <div style="font-size: 24px; font-weight: 600; color: #4f46e5; margin-top: 25px; letter-spacing: 2px;">ANGEBOT</div>
              </div>
            </div>

            <div class="recipient">
              <strong>${customerName}</strong><br>
              ${customerAddress}
            </div>

            <div style="margin-bottom: 30px; font-size: 14px; line-height: 1.6;">
              <p>Sehr geehrte Damen und Herren,</p>
              <p style="margin-top: 10px;">anbei erhalten Sie unser Angebot zu den angefragten Leistungen.</p>
            </div>

            <div class="meta-grid">
              <div class="meta-item">
                <label>Angebotsnummer</label>
                <span>${offer.offerNumber}</span>
              </div>
              <div class="meta-item">
                <label>Angebotsdatum</label>
                <span>${new Date(offer.date).toLocaleDateString('de-DE')}</span>
              </div>
              <div class="meta-item">
                <label>Gültig bis</label>
                <span>${new Date(offer.validUntil).toLocaleDateString('de-DE')}</span>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Beschreibung</th>
                  <th class="text-right">Menge</th>
                  <th class="text-right">Einzelpreis</th>
                  <th class="text-right">Gesamt</th>
                </tr>
              </thead>
              <tbody>
                ${offer.positions.map(pos => `
                  <tr>
                    <td><strong>${pos.description}</strong></td>
                    <td class="text-right">${pos.quantity} ${pos.unit}</td>
                    <td class="text-right">${pos.price.toLocaleString('de-DE', {minimumFractionDigits: 2})} €</td>
                    <td class="text-right">${pos.total.toLocaleString('de-DE', {minimumFractionDigits: 2})} €</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <div class="totals">
              <div class="total-row grand-total">
                <span>Gesamtbetrag</span>
                <span>${offer.totalNet.toLocaleString('de-DE', {minimumFractionDigits: 2})} €</span>
              </div>
            </div>

            ${offer.notes ? `
            <div style="margin-top: 20px; padding: 15px; background: #f9fafb; border-radius: 8px;">
              <p style="font-size: 11px; text-transform: uppercase; color: #666; margin-bottom: 8px;"><strong>Anmerkungen:</strong></p>
              <p style="font-size: 12px; color: #333;">${offer.notes.replace(/\n/g, '<br>')}</p>
            </div>
            ` : ''}
          </div>

          <div class="pre-footer">
            <p>Als Kleinunternehmer im Sinne von § 19 Abs. 1 UStG wird keine Umsatzsteuer berechnet und ausgewiesen.<br><br>Wir freuen uns auf Ihre Auftragserteilung!</p>
          </div>

          <div class="footer">
            <p><strong>Bankverbindung:</strong> Serhat Özden | IBAN: DE98 6205 0000 0007 4221 62 | Kreissparkasse Heilbronn</p>
          </div>
        </div>
        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };


  return (
    <div className="p-8 min-h-full flex flex-col animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Angebote</h1>
          <p className="text-slate-400">Angebote erstellen und verwalten.</p>
        </div>
        <div className="flex gap-3">
            <button 
                onClick={onAddOffer}
                className="group flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 hover:border-indigo-500/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)]"
            >
                <Plus className="w-4 h-4 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
                <span>Angebot erstellen</span>
            </button>
        </div>
      </div>

      {/* DASHBOARD STATS */}
      <div className="mb-8 space-y-4">
        {/* Row 1: Counts */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            
            {/* Total */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 shadow-lg">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-slate-800 rounded-lg text-slate-400">
                        <FileSpreadsheet className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Gesamt</span>
                </div>
                <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-2xl font-bold text-white">{stats.totalCount}</span>
                    <span className="text-sm text-slate-400">Angebote</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 mb-2">
                    <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: '100%' }}></div>
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                    <span>Erstellt</span>
                    <span>100%</span>
                </div>
            </div>

            {/* Accepted */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 shadow-lg">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                        <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-semibold text-emerald-400/80 uppercase tracking-wider">Angenommen</span>
                </div>
                <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-2xl font-bold text-white">{stats.acceptedCount}</span>
                    <span className="text-sm text-slate-400">Aufträge</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 mb-2">
                    <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${stats.acceptedPercent}%` }}></div>
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                    <span>Conversion</span>
                    <span>{stats.acceptedPercent.toFixed(0)}%</span>
                </div>
            </div>

            {/* Pipeline (Sent) */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 shadow-lg">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                        <Send className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-semibold text-blue-400/80 uppercase tracking-wider">Versendet</span>
                </div>
                <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-2xl font-bold text-white">{stats.sentCount}</span>
                    <span className="text-sm text-slate-400">Offen</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 mb-2">
                    <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${stats.sentPercent}%` }}></div>
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                    <span>In Prüfung</span>
                    <span>{stats.sentPercent.toFixed(0)}%</span>
                </div>
            </div>

            {/* Rejected */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 shadow-lg">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-red-500/10 rounded-lg text-red-400">
                        <XCircle className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-semibold text-red-400/80 uppercase tracking-wider">Abgelehnt</span>
                </div>
                <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-2xl font-bold text-white">{stats.rejectedCount}</span>
                    <span className="text-sm text-slate-400">Verloren</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 mb-2">
                    <div className="bg-red-500 h-1.5 rounded-full" style={{ width: `${stats.rejectedPercent}%` }}></div>
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                    <span>Verlustrate</span>
                    <span>{stats.rejectedPercent.toFixed(0)}%</span>
                </div>
            </div>
        </div>

        {/* Row 2: Money */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             {/* Total Volume */}
             <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                     <PieChart className="w-16 h-16" />
                 </div>
                <div className="flex flex-col mb-4 relative z-10">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Gesamtvolumen</span>
                    <span className="text-2xl font-bold text-white tracking-tight">
                        {stats.totalSum.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                    </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 mb-2 relative z-10">
                    <div className="bg-slate-400 h-1.5 rounded-full" style={{ width: '100%' }}></div>
                </div>
                 <div className="flex justify-between text-xs text-slate-500 relative z-10">
                    <span>Alle Angebote</span>
                    <span>100%</span>
                </div>
            </div>

            {/* Won Volume */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                     <TrendingUp className="w-16 h-16 text-emerald-500" />
                 </div>
                <div className="flex flex-col mb-4 relative z-10">
                    <span className="text-xs font-semibold text-emerald-400/80 uppercase tracking-wider mb-1">Gewonnenes Volumen</span>
                    <span className="text-2xl font-bold text-white tracking-tight">
                        {stats.wonSum.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                    </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 mb-2 relative z-10">
                    <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${stats.wonSumPercent}%` }}></div>
                </div>
                 <div className="flex justify-between text-xs text-slate-500 relative z-10">
                    <span>Auftragswert</span>
                    <span>{stats.wonSumPercent.toFixed(0)}%</span>
                </div>
            </div>

            {/* Pipeline Volume */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                     <Euro className="w-16 h-16 text-blue-500" />
                 </div>
                <div className="flex flex-col mb-4 relative z-10">
                    <span className="text-xs font-semibold text-blue-400/80 uppercase tracking-wider mb-1">Offene Pipeline</span>
                    <span className="text-2xl font-bold text-white tracking-tight">
                        {stats.pipelineSum.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                    </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 mb-2 relative z-10">
                    <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${stats.pipelineSumPercent}%` }}></div>
                </div>
                 <div className="flex justify-between text-xs text-slate-500 relative z-10">
                    <span>In Verhandlung</span>
                    <span>{stats.pipelineSumPercent.toFixed(0)}%</span>
                </div>
            </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
          <input 
            type="text"
            placeholder="Suche nach Angebotsnr., Kunde, Projekt..."
            className="w-full bg-slate-900/50 border border-slate-800 rounded-lg py-2 pl-9 pr-4 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all placeholder:text-slate-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="relative">
            <Filter className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 pointer-events-none" />
            <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as OfferStatus | 'ALL')}
                className="appearance-none bg-slate-900/50 text-sm text-slate-300 border border-slate-800 rounded-lg py-2 pl-9 pr-8 hover:bg-slate-800 hover:text-white transition-all focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50 cursor-pointer min-w-[160px]"
            >
                <option value="ALL">Alle Status</option>
                <option value="Entwurf">Entwurf</option>
                <option value="Versendet">Versendet</option>
                <option value="Angenommen">Angenommen</option>
                <option value="Abgelehnt">Abgelehnt</option>
            </select>
            <div className="absolute right-3 top-3 w-2 h-2 border-r-2 border-b-2 border-slate-500 rotate-45 pointer-events-none"></div>
        </div>
      </div>

      {/* Table Area */}
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-slate-900 z-10 shadow-sm border-b border-slate-800">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Angebotsnr.</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Kunde / Projekt</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Datum</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Gültig bis</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Betrag</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Aktionen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredOffers.length === 0 ? (
                <tr>
                    <td colSpan={7} className="px-6 py-32 text-center text-slate-500">
                        <div className="flex flex-col items-center justify-center gap-4">
                            <div className="w-20 h-20 rounded-full bg-slate-800/50 flex items-center justify-center border border-slate-800">
                                <FileSpreadsheet className="w-8 h-8 text-slate-600" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-lg font-medium text-slate-300">Keine Angebote gefunden</p>
                                <p className="text-sm">Passen Sie den Filter an oder erstellen Sie Ihr erstes Angebot.</p>
                            </div>
                        </div>
                    </td>
                </tr>
              ) : (
                filteredOffers.map((offer) => (
                  <tr 
                    key={offer.id} 
                    className="group hover:bg-slate-800/40 transition-all border-l-2 border-transparent hover:border-indigo-500"
                  >
                    <td 
                      onClick={() => onEditOffer(offer)}
                      className="px-6 py-4 text-white font-mono text-sm font-medium cursor-pointer"
                    >
                        {offer.offerNumber}
                    </td>
                    <td 
                      onClick={() => onEditOffer(offer)}
                      className="px-6 py-4 cursor-pointer"
                    >
                        <div className="font-medium text-slate-200">{getCustomerName(offer)}</div>
                        {offer.project && <div className="text-xs text-slate-400 mt-1 flex items-center gap-1"><span className="opacity-50">Projekt:</span> {offer.project}</div>}
                    </td>
                    <td 
                      onClick={() => onEditOffer(offer)}
                      className="px-6 py-4 text-slate-400 text-sm cursor-pointer"
                    >
                        {new Date(offer.date).toLocaleDateString('de-DE')}
                    </td>
                    <td 
                      onClick={() => onEditOffer(offer)}
                      className="px-6 py-4 text-slate-400 text-sm cursor-pointer"
                    >
                        {new Date(offer.validUntil).toLocaleDateString('de-DE')}
                    </td>
                    <td 
                      onClick={() => onEditOffer(offer)}
                      className="px-6 py-4 text-right font-bold text-slate-200 cursor-pointer"
                    >
                        {offer.totalNet.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                    </td>
                    <td 
                      onClick={() => onEditOffer(offer)}
                      className="px-6 py-4 text-center cursor-pointer"
                    >
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(offer.status)}`}>
                        {offer.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                             <button
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDuplicateOffer(offer); }}
                                className="p-2 flex items-center justify-center bg-slate-800 hover:bg-indigo-500/20 text-slate-400 hover:text-indigo-400 border border-slate-700 hover:border-indigo-500/30 rounded-lg transition-all"
                                title="Duplizieren"
                            >
                                <Copy className="w-4 h-4" />
                            </button>
                             <button 
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDownloadPDF(offer); }}
                                className="px-3 py-1.5 flex items-center gap-2 bg-slate-800 hover:bg-emerald-500/20 text-slate-400 hover:text-emerald-400 border border-slate-700 hover:border-emerald-500/30 rounded-lg transition-all text-xs font-medium group/btn"
                            >
                                <Download className="w-3.5 h-3.5" />
                                <span>PDF</span>
                            </button>
                        </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/80 text-xs text-slate-500 flex justify-between items-center backdrop-blur-md">
            <span>Zeige {filteredOffers.length} von {offers.length} Angeboten</span>
        </div>
      </div>
    </div>
  );
};