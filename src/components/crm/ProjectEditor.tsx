import React, { useState, useEffect } from 'react';
import { Project, ProjectStatus, ChecklistItem } from '@/types';
import { ArrowLeft, Save, Trash2, Plus, X, GripVertical, CheckSquare, Square } from 'lucide-react';

interface ProjectEditorProps {
  project: Project | null;
  onSave: (project: Project) => void;
  onDelete: (id: string) => void;
  onCancel: () => void;
}

export const ProjectEditor: React.FC<ProjectEditorProps> = ({
  project,
  onSave,
  onDelete,
  onCancel
}) => {
  const isNewProject = !project;

  // Default checklist for new projects
  const defaultChecklist: ChecklistItem[] = [
    { id: crypto.randomUUID(), text: 'Domain & Hosting vorhanden', completed: false },
    { id: crypto.randomUUID(), text: 'Designauswahl und Entwicklung', completed: false },
    { id: crypto.randomUUID(), text: 'Keine externen Beschriftungen wie Lovable, Open AI', completed: false },
    { id: crypto.randomUUID(), text: 'Impressum prüfen', completed: false },
    { id: crypto.randomUUID(), text: 'Datenschutz prüfen', completed: false },
    { id: crypto.randomUUID(), text: 'SEO erstellen', completed: false },
    { id: crypto.randomUUID(), text: 'SEOBility prüfen (Score mindestens 90)', completed: false },
    { id: crypto.randomUUID(), text: 'Keine externen Tailwinds und Google Fonts', completed: false },
    { id: crypto.randomUUID(), text: 'Google Search Console hinzufügen', completed: false },
    { id: crypto.randomUUID(), text: 'Google Search Console Seiten indexieren', completed: false },
    { id: crypto.randomUUID(), text: 'Kein oezdens oder andere externe Begrifflichkeiten', completed: false },
  ];

  const [formData, setFormData] = useState<Project>(() => {
    if (project) {
      return { ...project };
    }
    return {
      id: crypto.randomUUID(),
      projectNumber: `PRJ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      name: '',
      description: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: null,
      status: 'Geplant',
      checklist: defaultChecklist
    };
  });

  const [newChecklistItem, setNewChecklistItem] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setHasChanges(true);
  }, [formData]);

  const handleInputChange = (field: keyof Project, value: string | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleStatusChange = (status: ProjectStatus) => {
    setFormData(prev => ({ ...prev, status }));
  };

  const handleAddChecklistItem = () => {
    if (!newChecklistItem.trim()) return;
    
    const newItem: ChecklistItem = {
      id: crypto.randomUUID(),
      text: newChecklistItem.trim(),
      completed: false
    };
    
    setFormData(prev => ({
      ...prev,
      checklist: [...prev.checklist, newItem]
    }));
    setNewChecklistItem('');
  };

  const handleToggleChecklistItem = (itemId: string) => {
    setFormData(prev => ({
      ...prev,
      checklist: prev.checklist.map(item =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      )
    }));
  };

  const handleRemoveChecklistItem = (itemId: string) => {
    setFormData(prev => ({
      ...prev,
      checklist: prev.checklist.filter(item => item.id !== itemId)
    }));
  };

  const handleUpdateChecklistText = (itemId: string, text: string) => {
    setFormData(prev => ({
      ...prev,
      checklist: prev.checklist.map(item =>
        item.id === itemId ? { ...item, text } : item
      )
    }));
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      alert('Bitte gib einen Projektnamen ein');
      return;
    }
    onSave(formData);
  };

  const handleDelete = () => {
    if (window.confirm('Möchtest du dieses Projekt wirklich löschen?')) {
      onDelete(formData.id);
    }
  };

  const statusOptions: { value: ProjectStatus; label: string; color: string }[] = [
    { value: 'Geplant', label: 'Geplant', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20' },
    { value: 'In Arbeit', label: 'In Arbeit', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30 hover:bg-blue-500/20' },
    { value: 'Pausiert', label: 'Pausiert', color: 'bg-orange-500/10 text-orange-400 border-orange-500/30 hover:bg-orange-500/20' },
    { value: 'Abgeschlossen', label: 'Abgeschlossen', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20' },
    { value: 'Abgebrochen', label: 'Abgebrochen', color: 'bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20' },
  ];

  const completedCount = formData.checklist.filter(item => item.completed).length;
  const totalCount = formData.checklist.length;
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="p-4 lg:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={onCancel}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">
              {isNewProject ? 'Neues Projekt' : 'Projekt bearbeiten'}
            </h1>
            <p className="text-slate-400 text-sm mt-0.5">{formData.projectNumber}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isNewProject && (
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/20 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Löschen</span>
            </button>
          )}
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors font-medium shadow-lg shadow-indigo-500/20"
          >
            <Save className="w-4 h-4" />
            Speichern
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Basic Info Card */}
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Projektdetails</h2>
          
          <div className="grid gap-4 md:grid-cols-2">
            {/* Project Name */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Projektname *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="z.B. Website Redesign"
                className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Beschreibung
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Projektbeschreibung..."
                rows={3}
                className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 resize-none"
              />
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Startdatum
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50"
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Enddatum (optional)
              </label>
              <input
                type="date"
                value={formData.endDate || ''}
                onChange={(e) => handleInputChange('endDate', e.target.value || null)}
                className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50"
              />
            </div>
          </div>
        </div>

        {/* Status Card */}
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Status</h2>
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleStatusChange(option.value)}
                className={`px-4 py-2 rounded-lg border transition-all text-sm font-medium ${
                  formData.status === option.value
                    ? option.color + ' ring-2 ring-offset-2 ring-offset-slate-900'
                    : 'bg-slate-800/50 text-slate-400 border-slate-700 hover:bg-slate-800'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Checklist Card */}
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-white">Checkliste</h2>
              {totalCount > 0 && (
                <p className="text-sm text-slate-400 mt-0.5">
                  {completedCount} von {totalCount} erledigt
                </p>
              )}
            </div>
            {totalCount > 0 && (
              <div className="text-right">
                <span className="text-2xl font-bold text-indigo-400">{Math.round(progressPercent)}%</span>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          {totalCount > 0 && (
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden mb-6">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          )}

          {/* Add New Item */}
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newChecklistItem}
              onChange={(e) => setNewChecklistItem(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddChecklistItem()}
              placeholder="Neue Aufgabe hinzufügen..."
              className="flex-1 px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50"
            />
            <button
              onClick={handleAddChecklistItem}
              disabled={!newChecklistItem.trim()}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {/* Checklist Items */}
          {formData.checklist.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <CheckSquare className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p>Noch keine Aufgaben hinzugefügt</p>
            </div>
          ) : (
            <div className="space-y-2">
              {formData.checklist.map((item, index) => (
                <div
                  key={item.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                    item.completed
                      ? 'bg-emerald-500/5 border-emerald-500/20'
                      : 'bg-slate-800/30 border-slate-700/50 hover:border-slate-600/50'
                  }`}
                >
                  <button
                    onClick={() => handleToggleChecklistItem(item.id)}
                    className={`flex-shrink-0 transition-colors ${
                      item.completed ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {item.completed ? (
                      <CheckSquare className="w-5 h-5" />
                    ) : (
                      <Square className="w-5 h-5" />
                    )}
                  </button>
                  <input
                    type="text"
                    value={item.text}
                    onChange={(e) => handleUpdateChecklistText(item.id, e.target.value)}
                    className={`flex-1 bg-transparent border-none outline-none text-sm ${
                      item.completed ? 'text-slate-500 line-through' : 'text-white'
                    }`}
                  />
                  <button
                    onClick={() => handleRemoveChecklistItem(item.id)}
                    className="flex-shrink-0 p-1 text-slate-500 hover:text-red-400 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
