import React, { useState } from 'react';
import { Customer, CustomerStatus } from '@/types';
import { Plus, Search, Filter, ChevronRight, Phone, Trash2 } from 'lucide-react';

interface CustomerListProps {
  customers: Customer[];
  onAddCustomer: () => void;
  onEditCustomer: (customer: Customer) => void;
  onDeleteCustomer: (id: string) => void;
}

export const CustomerList: React.FC<CustomerListProps> = ({ 
  customers, 
  onAddCustomer, 
  onEditCustomer,
  onDeleteCustomer
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<CustomerStatus | 'ALL'>('ALL');

  const filteredCustomers = customers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.customerNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = statusFilter === 'ALL' || c.status === statusFilter;

    return matchesSearch && matchesFilter;
  });

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const getStatusColor = (status: CustomerStatus) => {
    switch (status) {
      case CustomerStatus.Active: return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case CustomerStatus.Lead: return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case CustomerStatus.Churned: return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 tracking-tight">Kundenübersicht</h1>
          <p className="text-sm sm:text-base text-slate-400">Verwalten und analysieren Sie Ihren Kundenstamm.</p>
        </div>
        <div className="flex gap-3">
            <button 
                onClick={onAddCustomer}
                className="group flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 hover:border-indigo-500/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)]"
            >
                <Plus className="w-4 h-4 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
                <span className="hidden sm:inline">Kunde hinzufügen</span>
                <span className="sm:hidden">Hinzufügen</span>
            </button>
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
                onChange={(e) => setStatusFilter(e.target.value as CustomerStatus | 'ALL')}
                className="appearance-none w-full sm:w-auto bg-slate-900/50 text-sm text-slate-300 border border-slate-800 rounded-lg py-2 pl-9 pr-8 hover:bg-slate-800 hover:text-white transition-all focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50 cursor-pointer sm:min-w-[160px]"
            >
                <option value="ALL">Alle Status</option>
                {Object.values(CustomerStatus).map(status => (
                    <option key={status} value={status}>{status}</option>
                ))}
            </select>
            <div className="absolute right-3 top-3 w-2 h-2 border-r-2 border-b-2 border-slate-500 rotate-45 pointer-events-none"></div>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-3">
        {filteredCustomers.length === 0 ? (
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8 text-center">
            <Search className="w-8 h-8 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-300 font-medium">Keine Kunden gefunden</p>
            <p className="text-sm text-slate-500">Passen Sie Ihre Suche an.</p>
          </div>
        ) : (
          filteredCustomers.map((customer) => (
            <div
              key={customer.id}
              onClick={() => onEditCustomer(customer)}
              className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 hover:border-indigo-500/50 transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center border border-slate-600 text-slate-200 font-bold text-sm flex-shrink-0">
                    {getInitials(customer.name)}
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium text-white truncate">{customer.name}</div>
                    <div className="text-sm text-slate-400 truncate">{customer.company}</div>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border flex-shrink-0 ${getStatusColor(customer.status)}`}>
                  {customer.status}
                </span>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-sm">
                <span className="text-slate-500 font-mono">#{customer.customerNumber}</span>
                <div className="flex items-center gap-4">
                  {customer.phone && (
                    <span className="text-slate-400 flex items-center gap-1">
                      <Phone className="w-3 h-3" /> {customer.phone}
                    </span>
                  )}
                  <button 
                    onClick={(e) => { e.stopPropagation(); onDeleteCustomer(customer.id); }}
                    className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <ChevronRight className="w-4 h-4 text-slate-600" />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:flex flex-1 bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex-col">
        <div className="overflow-auto custom-scrollbar flex-1">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-slate-900 z-10 shadow-sm border-b border-slate-800">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider w-16">#</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Kunde</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Firma</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Telefon</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden xl:table-cell">E-Mail</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider w-24"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredCustomers.length === 0 ? (
                <tr>
                    <td colSpan={7} className="px-6 py-32 text-center text-slate-500">
                        <div className="flex flex-col items-center justify-center gap-4">
                            <div className="w-20 h-20 rounded-full bg-slate-800/50 flex items-center justify-center border border-slate-800">
                                <Search className="w-8 h-8 text-slate-600" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-lg font-medium text-slate-300">Keine Kunden gefunden</p>
                                <p className="text-sm">Passen Sie Ihre Suche oder Filter an.</p>
                            </div>
                        </div>
                    </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr 
                    key={customer.id} 
                    onClick={() => onEditCustomer(customer)}
                    className="group hover:bg-slate-800/40 transition-all cursor-pointer border-l-2 border-transparent hover:border-indigo-500"
                  >
                    <td className="px-6 py-4 text-slate-500 font-mono text-sm">
                        {customer.customerNumber}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center border border-slate-600 text-slate-200 font-bold text-sm shadow-inner group-hover:from-indigo-600 group-hover:to-violet-600 group-hover:border-indigo-400 group-hover:text-white transition-all">
                            {getInitials(customer.name)}
                        </div>
                        <div>
                          <div className="font-medium text-slate-200 group-hover:text-white transition-colors">{customer.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-sm font-medium">
                        {customer.company}
                    </td>
                     <td className="px-6 py-4 text-slate-400 text-sm">
                         <div className="flex items-center gap-2">
                             <Phone className="w-3 h-3 text-slate-600" />
                             {customer.phone || '-'}
                         </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(customer.status)}`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-2 ${customer.status === CustomerStatus.Active ? 'bg-emerald-400' : customer.status === CustomerStatus.Lead ? 'bg-blue-400' : 'bg-slate-400'}`}></span>
                        {customer.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-sm hidden xl:table-cell">
                      {customer.email}
                    </td>
                    <td className="px-6 py-4 text-right">
                       <div className="flex items-center justify-end gap-2">
                            <button 
                                onClick={(e) => { e.stopPropagation(); onDeleteCustomer(customer.id); }}
                                className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                title="Löschen"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                            <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-indigo-400 transition-colors" />
                        </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/80 text-xs text-slate-500 flex justify-between items-center backdrop-blur-md">
            <span>Zeige {filteredCustomers.length} von {customers.length} Kunden</span>
        </div>
      </div>

      {/* Mobile Footer */}
      <div className="lg:hidden mt-4 text-center text-xs text-slate-500">
        {filteredCustomers.length} von {customers.length} Kunden
      </div>
    </div>
  );
};
