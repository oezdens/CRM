import React, { useState } from 'react';
import { Article } from '@/types';
import { Plus, Search, Filter, ChevronRight, Package, Tag, Trash2 } from 'lucide-react';

interface ArticleListProps {
  articles: Article[];
  onAddArticle: () => void;
  onEditArticle: (article: Article) => void;
  onDeleteArticle: (id: string) => void;
}

export const ArticleList: React.FC<ArticleListProps> = ({ 
  articles, 
  onAddArticle, 
  onEditArticle,
  onDeleteArticle
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredArticles = articles.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Artikelverwaltung</h1>
          <p className="text-slate-400">Ihre Produkte und Dienstleistungen im Überblick.</p>
        </div>
        <div className="flex gap-3">
            <button 
                onClick={onAddArticle}
                className="group relative flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 hover:border-indigo-500/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)]"
            >
                <Plus className="w-4 h-4 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
                <span>Neuer Artikel</span>
            </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
          <input 
            type="text"
            placeholder="Suche nach Artikelname, SKU..."
            className="w-full bg-slate-900/50 border border-slate-800 rounded-lg py-2 pl-9 pr-4 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all placeholder:text-slate-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table Area */}
      <div className="flex-1 bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
        <div className="overflow-auto custom-scrollbar flex-1">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-slate-900 z-10 shadow-sm border-b border-slate-800">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider w-32">SKU</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Artikelname</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden xl:table-cell">Beschreibung</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Preis</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider w-24"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredArticles.length === 0 ? (
                <tr>
                    <td colSpan={6} className="px-6 py-32 text-center text-slate-500">
                        <div className="flex flex-col items-center justify-center gap-4">
                            <div className="w-20 h-20 rounded-full bg-slate-800/50 flex items-center justify-center border border-slate-800">
                                <Package className="w-8 h-8 text-slate-600" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-lg font-medium text-slate-300">Keine Artikel gefunden</p>
                                <p className="text-sm">Erstellen Sie Ihren ersten Artikel.</p>
                            </div>
                        </div>
                    </td>
                </tr>
              ) : (
                filteredArticles.map((article) => (
                  <tr 
                    key={article.id} 
                    className="group hover:bg-slate-800/40 transition-all cursor-pointer border-l-2 border-transparent hover:border-indigo-500"
                    onClick={() => onEditArticle(article)}
                  >
                    <td className="px-6 py-4 text-slate-500 font-mono text-sm">
                        {article.sku}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                         <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                            <Tag className="w-4 h-4" />
                         </div>
                         <span className="font-medium text-slate-200 group-hover:text-white transition-colors">{article.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-sm hidden xl:table-cell max-w-xs truncate">
                        {article.description}
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-emerald-400">
                        {article.price.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                        <span className="text-slate-500 text-xs font-normal ml-1">/ {article.unit}</span>
                    </td>
                    <td className="px-6 py-4">
                        {article.isActive ? (
                             <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                                <span className="w-1.5 h-1.5 rounded-full mr-2 bg-emerald-400"></span>
                                Aktiv
                            </span>
                        ) : (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border bg-slate-500/10 text-slate-400 border-slate-500/20">
                                <span className="w-1.5 h-1.5 rounded-full mr-2 bg-slate-400"></span>
                                Inaktiv
                            </span>
                        )}
                    </td>
                    <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                            <button 
                                onClick={(e) => { e.stopPropagation(); onDeleteArticle(article.id); }}
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
            <span>Zeige {filteredArticles.length} von {articles.length} Artikeln</span>
        </div>
      </div>
    </div>
  );
};
