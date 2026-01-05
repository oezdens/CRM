import React, { useState } from 'react';
import { ViewState } from '@/types';
import { LayoutDashboard, Users, Package, FileText, FileSpreadsheet, Key, CheckSquare, UserCircle, Menu, X, LogOut, FolderKanban } from 'lucide-react';

interface SidebarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  userEmail?: string | null;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView, userEmail, onLogout }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'todos', label: 'To Do\'s', icon: CheckSquare },
    { id: 'projects', label: 'Projekte', icon: FolderKanban },
    { id: 'customers', label: 'Kunden', icon: Users },
    { id: 'articles', label: 'Artikel', icon: Package },
    { id: 'offers', label: 'Angebote', icon: FileSpreadsheet },
    { id: 'invoices', label: 'Rechnungen', icon: FileText },
    { id: 'rentals', label: 'Mietverträge', icon: Key },
  ];

  // Helper to check if a view belongs to a parent category
  const isStartOfSection = (itemId: string, current: string) => {
    if (itemId === current) return true;
    if (itemId === 'customers' && current === 'customer-editor') return true;
    if (itemId === 'articles' && current === 'article-editor') return true;
    if (itemId === 'invoices' && current === 'invoice-editor') return true;
    if (itemId === 'offers' && current === 'offer-editor') return true;
    if (itemId === 'rentals' && current === 'rental-editor') return true;
    if (itemId === 'projects' && current === 'project-editor') return true;
    return false;
  };

  const handleNavClick = (view: ViewState) => {
    onChangeView(view);
    setIsMobileOpen(false);
  };

  const sidebarContent = (
    <>
      <div className="p-4 lg:p-6 flex items-center gap-3">
        <div className="relative">
            <div className="absolute inset-0 bg-indigo-500 blur-lg opacity-40 rounded-full"></div>
            <div className="relative w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center text-white shadow-xl border border-white/10">
                <span className="font-bold text-lg">Ö</span>
            </div>
        </div>
        <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-white leading-tight">oezdensweb</span>
            <span className="text-[10px] uppercase tracking-widest text-indigo-400 font-semibold">CRM Suite</span>
        </div>
        {/* Mobile close button */}
        <button
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden ml-auto p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 px-3 py-3 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = isStartOfSection(item.id, currentView);
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id as ViewState)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 lg:py-2 rounded-lg transition-all duration-300 group relative overflow-hidden text-sm ${
                isActive 
                  ? 'bg-indigo-600/10 text-white shadow-[0_0_20px_rgba(79,70,229,0.15)] border border-indigo-500/20' 
                  : 'hover:bg-slate-800/50 hover:text-white border border-transparent'
              }`}
            >
              {isActive && <div className="absolute left-0 top-0 h-full w-1 bg-indigo-500 rounded-l-full"></div>}
              <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-indigo-400' : 'text-slate-400 group-hover:text-white'}`} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800/50 space-y-3">
        <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-800/30 border border-transparent">
          <UserCircle className="w-8 h-8 text-indigo-400 flex-shrink-0" />
          <div className="flex flex-col overflow-hidden">
            <span className="text-xs font-medium text-white truncate">Angemeldet als</span>
            <span className="text-[11px] text-slate-400 truncate">{userEmail || 'Nicht angemeldet'}</span>
          </div>
        </div>
        {onLogout && (
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all text-sm"
          >
            <LogOut className="w-4 h-4" />
            <span className="font-medium">Abmelden</span>
          </button>
        )}
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Header Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-xl border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-indigo-500 blur-lg opacity-40 rounded-full"></div>
            <div className="relative w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center text-white shadow-xl border border-white/10">
              <span className="font-bold text-sm">Ö</span>
            </div>
          </div>
          <span className="text-base font-bold tracking-tight text-white">oezdensweb</span>
        </div>
        <button
          onClick={() => setIsMobileOpen(true)}
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <div className={`lg:hidden fixed top-0 left-0 h-full w-72 z-50 bg-slate-900/95 backdrop-blur-xl border-r border-slate-800 flex flex-col text-slate-300 transform transition-transform duration-300 ease-in-out ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {sidebarContent}
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex w-64 h-screen sticky top-0 bg-slate-900/95 backdrop-blur-xl border-r border-slate-800 flex-col text-slate-300 relative z-20">
        {sidebarContent}
      </div>
    </>
  );
};