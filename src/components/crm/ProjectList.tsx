import React, { useState, useMemo } from 'react';
import { Project, ProjectStatus } from '@/types';
import { Plus, Search, Filter, Pencil, Trash2, FolderKanban, Calendar, CheckSquare, Clock, PlayCircle, PauseCircle, XCircle, CheckCircle2 } from 'lucide-react';

interface ProjectListProps {
  projects: Project[];
  onAddProject: () => void;
  onEditProject: (project: Project) => void;
  onDeleteProject: (id: string) => void;
}

export const ProjectList: React.FC<ProjectListProps> = ({ 
  projects, 
  onAddProject, 
  onEditProject,
  onDeleteProject
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'ALL'>('ALL');

  // --- Statistics Calculation ---
  const stats = useMemo(() => {
    const totalCount = projects.length;
    const plannedCount = projects.filter(p => p.status === 'Geplant').length;
    const inProgressCount = projects.filter(p => p.status === 'In Arbeit').length;
    const completedCount = projects.filter(p => p.status === 'Abgeschlossen').length;
    const pausedCount = projects.filter(p => p.status === 'Pausiert').length;

    return {
      totalCount,
      plannedCount,
      inProgressCount,
      completedCount,
      pausedCount,
      plannedPercent: totalCount ? (plannedCount / totalCount) * 100 : 0,
      inProgressPercent: totalCount ? (inProgressCount / totalCount) * 100 : 0,
      completedPercent: totalCount ? (completedCount / totalCount) * 100 : 0,
    };
  }, [projects]);

  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case 'Abgeschlossen': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'In Arbeit': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Geplant': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Pausiert': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case 'Abgebrochen': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  const getStatusIcon = (status: ProjectStatus) => {
    switch (status) {
      case 'Abgeschlossen': return <CheckCircle2 className="w-3.5 h-3.5" />;
      case 'In Arbeit': return <PlayCircle className="w-3.5 h-3.5" />;
      case 'Geplant': return <Clock className="w-3.5 h-3.5" />;
      case 'Pausiert': return <PauseCircle className="w-3.5 h-3.5" />;
      case 'Abgebrochen': return <XCircle className="w-3.5 h-3.5" />;
      default: return null;
    }
  };

  const getChecklistProgress = (project: Project) => {
    if (!project.checklist || project.checklist.length === 0) return null;
    const completed = project.checklist.filter(item => item.completed).length;
    const total = project.checklist.length;
    const percent = (completed / total) * 100;
    return { completed, total, percent };
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.projectNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = statusFilter === 'ALL' || project.status === statusFilter;

    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Projekte</h1>
          <p className="text-slate-400 text-sm mt-1">Verwalte deine Projekte und Aufgaben</p>
        </div>
        <button
          onClick={onAddProject}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors font-medium shadow-lg shadow-indigo-500/20"
        >
          <Plus className="w-4 h-4" />
          Neues Projekt
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/10 rounded-lg">
              <FolderKanban className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.totalCount}</p>
              <p className="text-xs text-slate-400">Gesamt</p>
            </div>
          </div>
        </div>
        
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-500/10 rounded-lg">
              <PlayCircle className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.inProgressCount}</p>
              <p className="text-xs text-slate-400">In Arbeit</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 rounded-lg">
              <Clock className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.plannedCount}</p>
              <p className="text-xs text-slate-400">Geplant</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.completedCount}</p>
              <p className="text-xs text-slate-400">Abgeschlossen</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Projekte suchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900/50 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ProjectStatus | 'ALL')}
            className="pl-10 pr-8 py-2.5 bg-slate-900/50 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-indigo-500/50 appearance-none cursor-pointer min-w-[160px]"
          >
            <option value="ALL">Alle Status</option>
            <option value="Geplant">Geplant</option>
            <option value="In Arbeit">In Arbeit</option>
            <option value="Pausiert">Pausiert</option>
            <option value="Abgeschlossen">Abgeschlossen</option>
            <option value="Abgebrochen">Abgebrochen</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/30 border border-slate-800/50 rounded-xl">
          <FolderKanban className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-400 mb-2">Keine Projekte gefunden</h3>
          <p className="text-slate-500 text-sm mb-4">
            {searchTerm || statusFilter !== 'ALL' 
              ? 'Versuche andere Suchbegriffe oder Filter' 
              : 'Erstelle dein erstes Projekt'}
          </p>
          {!searchTerm && statusFilter === 'ALL' && (
            <button
              onClick={onAddProject}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              Projekt erstellen
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredProjects.map((project) => {
            const progress = getChecklistProgress(project);
            return (
              <div
                key={project.id}
                className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-xl p-5 hover:border-slate-700/50 transition-all group"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-slate-500 font-mono">{project.projectNumber}</span>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full border ${getStatusColor(project.status)}`}>
                        {getStatusIcon(project.status)}
                        {project.status}
                      </span>
                    </div>
                    <h3 className="text-white font-semibold truncate">{project.name}</h3>
                  </div>
                </div>

                {/* Description */}
                {project.description && (
                  <p className="text-slate-400 text-sm mb-4 line-clamp-2">{project.description}</p>
                )}

                {/* Dates */}
                <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Start: {formatDate(project.startDate)}</span>
                  </div>
                  {project.endDate && (
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Ende: {formatDate(project.endDate)}</span>
                    </div>
                  )}
                </div>

                {/* Checklist Progress */}
                {progress && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <CheckSquare className="w-3.5 h-3.5" />
                        Fortschritt
                      </span>
                      <span className="text-slate-300">{progress.completed}/{progress.total}</span>
                    </div>
                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-300"
                        style={{ width: `${progress.percent}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 pt-3 border-t border-slate-800/50">
                  <button
                    onClick={() => onEditProject(project)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-800/50 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition-colors text-sm"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    Bearbeiten
                  </button>
                  <button
                    onClick={() => onDeleteProject(project.id)}
                    className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Löschen"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
