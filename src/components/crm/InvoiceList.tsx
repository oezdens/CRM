import React, { useState, useMemo, useEffect } from 'react';
import { Invoice, Customer, InvoiceStatus } from '@/types';
import { Plus, Search, Filter, Copy, Pencil, Trash2, FileText, Download, CheckCircle2, Clock, AlertCircle, Euro, Activity } from 'lucide-react';

// CSS for blinking animation
const blinkingStyle = `
@keyframes blink-red {
  0%, 100% { background-color: rgba(239, 68, 68, 0.15); }
  50% { background-color: rgba(239, 68, 68, 0.05); }
}
.animate-blink-red {
  animation: blink-red 1.5s ease-in-out infinite;
}
`;

interface InvoiceListProps {
  invoices: Invoice[];
  customers: Customer[];
  onAddInvoice: () => void;
  onEditInvoice: (invoice: Invoice) => void;
  onDeleteInvoice: (id: string) => void;
  onDuplicateInvoice: (invoice: Invoice) => void;
}

export const InvoiceList: React.FC<InvoiceListProps> = ({ 
  invoices, 
  customers,
  onAddInvoice, 
  onEditInvoice,
  onDeleteInvoice,
  onDuplicateInvoice
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | 'ALL'>('ALL');

  // Inject blinking animation styles
  useEffect(() => {
    const styleId = 'invoice-blink-style';
    if (!document.getElementById(styleId)) {
      const styleTag = document.createElement('style');
      styleTag.id = styleId;
      styleTag.textContent = blinkingStyle;
      document.head.appendChild(styleTag);
    }
  }, []);

  // Helper to check if invoice is overdue (due date in the past and not paid/cancelled)
  const isOverdue = (invoice: Invoice): boolean => {
    if (invoice.status === 'Bezahlt' || invoice.status === 'Storniert') return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(invoice.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate < today;
  };

  // Get effective status (auto-detect overdue)
  const getEffectiveStatus = (invoice: Invoice): InvoiceStatus => {
    if (isOverdue(invoice) && invoice.status !== 'Bezahlt' && invoice.status !== 'Storniert') {
      return 'Überfällig';
    }
    return invoice.status;
  };

  // --- Statistics Calculation ---
  const stats = useMemo(() => {
    const totalCount = invoices.length;
    const openCount = invoices.filter(i => getEffectiveStatus(i) === 'Offen').length;
    const paidCount = invoices.filter(i => i.status === 'Bezahlt').length;
    const overdueCount = invoices.filter(i => getEffectiveStatus(i) === 'Überfällig').length;

    const totalSum = invoices.reduce((acc, i) => acc + i.totalNet, 0);
    const paidSum = invoices.filter(i => i.status === 'Bezahlt').reduce((acc, i) => acc + i.totalNet, 0);
    // Open sum includes "Offen" and "Überfällig"
    const openSum = invoices.filter(i => ['Offen', 'Überfällig'].includes(getEffectiveStatus(i))).reduce((acc, i) => acc + i.totalNet, 0);

    return {
        totalCount,
        openCount,
        paidCount,
        overdueCount,
        totalSum,
        paidSum,
        openSum,
        // Percentages for bars
        openPercent: totalCount ? (openCount / totalCount) * 100 : 0,
        paidPercent: totalCount ? (paidCount / totalCount) * 100 : 0,
        overduePercent: totalCount ? (overdueCount / totalCount) * 100 : 0,
        paidSumPercent: totalSum ? (paidSum / totalSum) * 100 : 0,
        openSumPercent: totalSum ? (openSum / totalSum) * 100 : 0,
    };
  }, [invoices]);

  const getCustomerName = (id: string) => {
    const customer = customers.find(c => c.id === id);
    return customer ? (customer.company || customer.name) : 'Unbekannter Kunde';
  };

  const getStatusColor = (status: InvoiceStatus) => {
    switch (status) {
      case 'Bezahlt': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Offen': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Überfällig': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'Entwurf': return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
      case 'Storniert': return 'bg-slate-700/50 text-slate-500 border-slate-700';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getCustomerName(inv.customerId).toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = statusFilter === 'ALL' || inv.status === statusFilter;

    return matchesSearch && matchesFilter;
  });

  const handleDownloadPDF = (invoice: Invoice) => {
    const customer = customers.find(c => c.id === invoice.customerId);
    const customerName = customer ? (customer.company ? `${customer.company}<br>${customer.name}` : customer.name) : 'Unbekannter Kunde';
    const customerAddress = customer ? customer.address.replace(/\n/g, '<br>') : '';

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Rechnung ${invoice.invoiceNumber}</title>
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
                <div class="logo">CRM System</div>
                <div class="sender-address">
                  [Firma eintragen]<br>
                  [Straße]<br>
                  [PLZ Ort]<br>
                  Deutschland
                </div>
              </div>
              <div style="text-align: right;">
                <div style="font-size: 24px; font-weight: 600; color: #4f46e5; margin-top: 25px; letter-spacing: 2px;">RECHNUNG</div>
              </div>
            </div>

            <div class="recipient">
              <strong>${customerName}</strong><br>
              ${customerAddress}
            </div>

            <div style="margin-bottom: 30px; font-size: 14px; line-height: 1.6;">
              <p>Sehr geehrte Damen und Herren,</p>
              <p style="margin-top: 10px;">anbei erhalten Sie die Rechnung zu den erbrachten Leistungen.</p>
            </div>

            <div class="meta-grid">
              <div class="meta-item">
                <label>Rechnungsnummer</label>
                <span>${invoice.invoiceNumber}</span>
              </div>
              <div class="meta-item">
                <label>Rechnungsdatum</label>
                <span>${new Date(invoice.date).toLocaleDateString('de-DE')}</span>
              </div>
              <div class="meta-item">
                <label>Fällig am</label>
                <span>${new Date(invoice.dueDate).toLocaleDateString('de-DE')}</span>
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
                ${invoice.positions.map(pos => `
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
                <span>${invoice.totalNet.toLocaleString('de-DE', {minimumFractionDigits: 2})} €</span>
              </div>
            </div>

            ${invoice.notes ? `
            <div style="margin-top: 20px; padding: 15px; background: #f9fafb; border-radius: 8px;">
              <p style="font-size: 11px; text-transform: uppercase; color: #666; margin-bottom: 8px;"><strong>Anmerkungen:</strong></p>
              <p style="font-size: 12px; color: #333;">${invoice.notes.replace(/\n/g, '<br>')}</p>
            </div>
            ` : ''}
          </div>

          <div class="pre-footer">
            <p>Als Kleinunternehmer im Sinne von § 19 Abs. 1 UStG wird keine Umsatzsteuer berechnet und ausgewiesen.<br>Bitte überweisen Sie den Betrag unter Angabe der Rechnungsnummer.<br><br>Vielen Dank für Ihren Auftrag!</p>
          </div>

          <div class="footer">
            <p><strong>Bankverbindung:</strong> [Name] | IBAN: [IBAN] | [Bank]</p>
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
    <div className="p-4 sm:p-6 lg:p-8 min-h-full flex flex-col animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 tracking-tight">Rechnungen</h1>
          <p className="text-sm sm:text-base text-slate-400">Finanzübersicht und Forderungsmanagement.</p>
        </div>
        <div className="flex gap-3">
            <button 
                onClick={onAddInvoice}
                className="group flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 hover:border-indigo-500/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)]"
            >
                <Plus className="w-4 h-4 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
                <span className="hidden sm:inline">Rechnung erstellen</span>
                <span className="sm:hidden">Erstellen</span>
            </button>
        </div>
      </div>

      {/* DASHBOARD STATS */}
      <div className="mb-6 sm:mb-8 space-y-3 sm:space-y-4">
        {/* Count Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            
            {/* Total */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl sm:rounded-2xl p-3 sm:p-5 shadow-lg">
                <div className="flex justify-between items-start mb-2 sm:mb-4">
                    <div className="p-1.5 sm:p-2 bg-slate-800 rounded-lg text-slate-400">
                        <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <span className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">Gesamt</span>
                </div>
                <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-xl sm:text-2xl font-bold text-white">{stats.totalCount}</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1 sm:h-1.5">
                    <div className="bg-indigo-500 h-1 sm:h-1.5 rounded-full" style={{ width: '100%' }}></div>
                </div>
            </div>

            {/* Open */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl sm:rounded-2xl p-3 sm:p-5 shadow-lg">
                <div className="flex justify-between items-start mb-2 sm:mb-4">
                    <div className="p-1.5 sm:p-2 bg-blue-500/10 rounded-lg text-blue-400">
                        <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <span className="text-[10px] sm:text-xs font-semibold text-blue-400/80 uppercase tracking-wider">Offen</span>
                </div>
                <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-xl sm:text-2xl font-bold text-white">{stats.openCount}</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1 sm:h-1.5">
                    <div className="bg-blue-500 h-1 sm:h-1.5 rounded-full" style={{ width: `${stats.openPercent}%` }}></div>
                </div>
            </div>

            {/* Paid */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl sm:rounded-2xl p-3 sm:p-5 shadow-lg">
                <div className="flex justify-between items-start mb-2 sm:mb-4">
                    <div className="p-1.5 sm:p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                        <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <span className="text-[10px] sm:text-xs font-semibold text-emerald-400/80 uppercase tracking-wider">Bezahlt</span>
                </div>
                <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-xl sm:text-2xl font-bold text-white">{stats.paidCount}</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1 sm:h-1.5">
                    <div className="bg-emerald-500 h-1 sm:h-1.5 rounded-full" style={{ width: `${stats.paidPercent}%` }}></div>
                </div>
            </div>

            {/* Overdue */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl sm:rounded-2xl p-3 sm:p-5 shadow-lg">
                <div className="flex justify-between items-start mb-2 sm:mb-4">
                    <div className="p-1.5 sm:p-2 bg-red-500/10 rounded-lg text-red-400">
                        <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <span className="text-[10px] sm:text-xs font-semibold text-red-400/80 uppercase tracking-wider">Überfällig</span>
                </div>
                <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-xl sm:text-2xl font-bold text-white">{stats.overdueCount}</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1 sm:h-1.5">
                    <div className="bg-red-500 h-1 sm:h-1.5 rounded-full" style={{ width: `${stats.overduePercent}%` }}></div>
                </div>
            </div>
        </div>

        {/* Money Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
             {/* Total Volume */}
             <div className="bg-slate-900/50 border border-slate-800 rounded-xl sm:rounded-2xl p-3 sm:p-5 shadow-lg relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity hidden sm:block">
                     <Euro className="w-16 h-16" />
                 </div>
                <div className="flex flex-col mb-2 sm:mb-4 relative z-10">
                    <span className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Gesamtwert</span>
                    <span className="text-lg sm:text-2xl font-bold text-white tracking-tight">
                        {stats.totalSum.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                    </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1 sm:h-1.5 relative z-10">
                    <div className="bg-slate-400 h-1 sm:h-1.5 rounded-full" style={{ width: '100%' }}></div>
                </div>
            </div>

            {/* Paid Volume */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl sm:rounded-2xl p-3 sm:p-5 shadow-lg relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity hidden sm:block">
                     <Activity className="w-16 h-16 text-emerald-500" />
                 </div>
                <div className="flex flex-col mb-2 sm:mb-4 relative z-10">
                    <span className="text-[10px] sm:text-xs font-semibold text-emerald-400/80 uppercase tracking-wider mb-1">Bezahlt</span>
                    <span className="text-lg sm:text-2xl font-bold text-white tracking-tight">
                        {stats.paidSum.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                    </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1 sm:h-1.5 relative z-10">
                    <div className="bg-emerald-500 h-1 sm:h-1.5 rounded-full" style={{ width: `${stats.paidSumPercent}%` }}></div>
                </div>
            </div>

            {/* Open Volume */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl sm:rounded-2xl p-3 sm:p-5 shadow-lg relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity hidden sm:block">
                     <Activity className="w-16 h-16 text-blue-500" />
                 </div>
                <div className="flex flex-col mb-2 sm:mb-4 relative z-10">
                    <span className="text-[10px] sm:text-xs font-semibold text-blue-400/80 uppercase tracking-wider mb-1">Offen</span>
                    <span className="text-lg sm:text-2xl font-bold text-white tracking-tight">
                        {stats.openSum.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                    </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1 sm:h-1.5 relative z-10">
                    <div className="bg-blue-500 h-1 sm:h-1.5 rounded-full" style={{ width: `${stats.openSumPercent}%` }}></div>
                </div>
            </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
        <div className="relative flex-1 sm:max-w-md">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
          <input 
            type="text"
            placeholder="Suche..."
            className="w-full bg-slate-900/50 border border-slate-800 rounded-lg py-2 pl-9 pr-4 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all placeholder:text-slate-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="relative">
            <Filter className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 pointer-events-none" />
            <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as InvoiceStatus | 'ALL')}
                className="appearance-none w-full sm:w-auto bg-slate-900/50 text-sm text-slate-300 border border-slate-800 rounded-lg py-2 pl-9 pr-8 hover:bg-slate-800 hover:text-white transition-all focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50 cursor-pointer sm:min-w-[160px]"
            >
                <option value="ALL">Alle Status</option>
                <option value="Entwurf">Entwurf</option>
                <option value="Offen">Offen</option>
                <option value="Bezahlt">Bezahlt</option>
                <option value="Überfällig">Überfällig</option>
                <option value="Storniert">Storniert</option>
            </select>
            <div className="absolute right-3 top-3 w-2 h-2 border-r-2 border-b-2 border-slate-500 rotate-45 pointer-events-none"></div>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-3">
        {filteredInvoices.length === 0 ? (
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8 text-center">
            <FileText className="w-8 h-8 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-300 font-medium">Keine Rechnungen gefunden</p>
          </div>
        ) : (
          filteredInvoices.map((invoice) => (
            <div
              key={invoice.id}
              className={`border rounded-xl p-4 transition-all ${
                getEffectiveStatus(invoice) === 'Überfällig'
                  ? 'animate-blink-red border-red-500/50'
                  : 'bg-slate-900/50 border-slate-800 hover:border-indigo-500/50'
              }`}
            >
              <div 
                onClick={() => onEditInvoice(invoice)}
                className="cursor-pointer"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="font-mono text-sm font-medium text-white">{invoice.invoiceNumber}</div>
                    <div className="text-sm text-slate-400">{getCustomerName(invoice.customerId)}</div>
                  </div>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(getEffectiveStatus(invoice))}`}>
                    {getEffectiveStatus(invoice)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm border-t border-slate-800 pt-3">
                  <div className="text-slate-500">
                    <span>{new Date(invoice.date).toLocaleDateString('de-DE')}</span>
                    <span className="mx-2">•</span>
                    <span>Fällig: {new Date(invoice.dueDate).toLocaleDateString('de-DE')}</span>
                  </div>
                  <div className="font-bold text-white">
                    {invoice.totalNet.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-3 pt-3 border-t border-slate-800">
                <button
                  onClick={() => onDuplicateInvoice(invoice)}
                  className="flex-1 py-2 flex items-center justify-center gap-2 bg-slate-800 text-slate-400 rounded-lg text-xs"
                >
                  <Copy className="w-3.5 h-3.5" /> Duplizieren
                </button>
                <button 
                  onClick={() => handleDownloadPDF(invoice)}
                  className="flex-1 py-2 flex items-center justify-center gap-2 bg-emerald-500/10 text-emerald-400 rounded-lg text-xs"
                >
                  <Download className="w-3.5 h-3.5" /> PDF
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Table Area */}
      <div className="hidden lg:flex bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-slate-900 z-10 shadow-sm border-b border-slate-800">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Rechnungsnr.</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Kunde</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Datum</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Fällig am</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Betrag</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Aktionen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredInvoices.length === 0 ? (
                <tr>
                    <td colSpan={7} className="px-6 py-32 text-center text-slate-500">
                        <div className="flex flex-col items-center justify-center gap-4">
                            <div className="w-20 h-20 rounded-full bg-slate-800/50 flex items-center justify-center border border-slate-800">
                                <FileText className="w-8 h-8 text-slate-600" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-lg font-medium text-slate-300">Keine Rechnungen gefunden</p>
                                <p className="text-sm">Passen Sie den Filter an oder erstellen Sie eine neue Rechnung.</p>
                            </div>
                        </div>
                    </td>
                </tr>
              ) : (
                filteredInvoices.map((invoice) => (
                  <tr 
                    key={invoice.id} 
                    className={`group transition-all border-l-2 border-transparent hover:border-indigo-500 ${
                      getEffectiveStatus(invoice) === 'Überfällig' 
                        ? 'animate-blink-red border-l-red-500' 
                        : 'hover:bg-slate-800/40'
                    }`}
                  >
                    <td 
                      onClick={() => onEditInvoice(invoice)}
                      className="px-6 py-4 text-white font-mono text-sm font-medium cursor-pointer"
                    >
                        {invoice.invoiceNumber}
                    </td>
                    <td 
                      onClick={() => onEditInvoice(invoice)}
                      className="px-6 py-4 cursor-pointer"
                    >
                        <div className="font-medium text-slate-200">{getCustomerName(invoice.customerId)}</div>
                    </td>
                    <td 
                      onClick={() => onEditInvoice(invoice)}
                      className="px-6 py-4 text-slate-400 text-sm cursor-pointer"
                    >
                        {new Date(invoice.date).toLocaleDateString('de-DE')}
                    </td>
                    <td 
                      onClick={() => onEditInvoice(invoice)}
                      className="px-6 py-4 text-slate-400 text-sm cursor-pointer"
                    >
                        {new Date(invoice.dueDate).toLocaleDateString('de-DE')}
                    </td>
                    <td 
                      onClick={() => onEditInvoice(invoice)}
                      className="px-6 py-4 text-right font-bold text-slate-200 cursor-pointer"
                    >
                        {invoice.totalNet.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                    </td>
                    <td 
                      onClick={() => onEditInvoice(invoice)}
                      className="px-6 py-4 text-center cursor-pointer"
                    >
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(getEffectiveStatus(invoice))}`}>
                        {getEffectiveStatus(invoice)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                             <button
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDuplicateInvoice(invoice); }}
                                className="p-2 flex items-center justify-center bg-slate-800 hover:bg-indigo-500/20 text-slate-400 hover:text-indigo-400 border border-slate-700 hover:border-indigo-500/30 rounded-lg transition-all"
                                title="Duplizieren"
                            >
                                <Copy className="w-4 h-4" />
                            </button>
                             <button 
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDownloadPDF(invoice); }}
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
            <span>Zeige {filteredInvoices.length} von {invoices.length} Rechnungen</span>
        </div>
      </div>

      {/* Mobile Footer */}
      <div className="lg:hidden mt-4 text-center text-xs text-slate-500">
        {filteredInvoices.length} von {invoices.length} Rechnungen
      </div>
    </div>
  );
};