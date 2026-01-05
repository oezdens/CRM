import React, { useState, useEffect } from 'react';
import { ToDo, ToDoStatus, ToDoPriority } from '@/types';
import { Plus, MoreHorizontal, Calendar, Trash2, GripVertical, CheckSquare, Save } from 'lucide-react';

interface ToDoBoardProps {
  todos: ToDo[];
  onAddToDo: (status: ToDoStatus) => void;
  onUpdateToDo: (id: string, updates: Partial<ToDo>) => void;
  onDeleteToDo: (id: string) => void;
  onMoveToDo: (id: string, newStatus: ToDoStatus) => void;
}

const COLUMNS: { id: ToDoStatus; title: string; color: string }[] = [
  { id: 'todo', title: 'Zu erledigen', color: 'bg-slate-500' },
  { id: 'in-progress', title: 'In Bearbeitung', color: 'bg-blue-500' },
  { id: 'review', title: 'Prüfung', color: 'bg-purple-500' },
  { id: 'done', title: 'Erledigt', color: 'bg-emerald-500' },
];

// Lokaler State für jede ToDo-Karte
interface LocalEdits {
  [todoId: string]: { title: string; description: string };
}

export const ToDoBoard: React.FC<ToDoBoardProps> = ({
  todos,
  onAddToDo,
  onUpdateToDo,
  onDeleteToDo,
  onMoveToDo,
}) => {
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [localEdits, setLocalEdits] = useState<LocalEdits>({});

  // Initialisiere lokale Edits wenn todos sich ändern
  useEffect(() => {
    const newEdits: LocalEdits = {};
    todos.forEach((todo) => {
      // Nur initialisieren, wenn noch nicht vorhanden (um Tippen nicht zu unterbrechen)
      if (!localEdits[todo.id]) {
        newEdits[todo.id] = { title: todo.title, description: todo.description };
      } else {
        newEdits[todo.id] = localEdits[todo.id];
      }
    });
    setLocalEdits(newEdits);
  }, [todos]);

  // Prüft ob es ungespeicherte Änderungen gibt
  const hasUnsavedChanges = (todoId: string) => {
    const todo = todos.find(t => t.id === todoId);
    const local = localEdits[todoId];
    if (!todo || !local) return false;
    return todo.title !== local.title || todo.description !== local.description;
  };

  // Lokale Änderung updaten (ohne Datenbank)
  const handleLocalChange = (todoId: string, field: 'title' | 'description', value: string) => {
    setLocalEdits(prev => ({
      ...prev,
      [todoId]: {
        ...prev[todoId],
        [field]: value
      }
    }));
  };

  // Speichern in die Datenbank
  const handleSave = (todoId: string) => {
    const local = localEdits[todoId];
    if (local) {
      onUpdateToDo(todoId, { title: local.title, description: local.description });
    }
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, status: ToDoStatus) => {
    e.preventDefault();
    if (draggedId) {
      onMoveToDo(draggedId, status);
      setDraggedId(null);
    }
  };

  const getPriorityColor = (priority: ToDoPriority) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'medium': return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
      case 'low': return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 h-full flex flex-col overflow-hidden animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 tracking-tight">Aufgaben</h1>
          <p className="text-sm sm:text-base text-slate-400">Verwalten Sie Ihre Aufgaben im Kanban-Stil.</p>
        </div>
      </div>

      {/* Mobile: Stack columns vertically */}
      <div className="flex-1 overflow-y-auto lg:overflow-x-auto lg:overflow-y-hidden">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 lg:h-full lg:min-w-[1200px]">
          {COLUMNS.map((col) => {
            const colTodos = todos.filter((t) => t.status === col.id);
            
            return (
              <div
                key={col.id}
                className="flex flex-col bg-slate-900/40 backdrop-blur-sm border border-slate-800 rounded-xl lg:rounded-2xl lg:flex-1 lg:min-w-[300px]"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, col.id)}
              >
                {/* Column Header */}
                <div className="p-3 lg:p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50 rounded-t-xl lg:rounded-t-2xl">
                    <div className="flex items-center gap-2 lg:gap-3">
                        <div className={`w-2.5 h-2.5 lg:w-3 lg:h-3 rounded-full ${col.color}`}></div>
                        <h3 className="font-semibold text-white text-sm lg:text-base">{col.title}</h3>
                        <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">{colTodos.length}</span>
                    </div>
                    <button 
                        onClick={() => onAddToDo(col.id)}
                        className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-white transition-colors"
                    >
                        <Plus className="w-4 h-4 lg:w-5 lg:h-5" />
                    </button>
                </div>

                {/* Column Content */}
                <div className="p-3 lg:p-4 lg:flex-1 lg:overflow-y-auto custom-scrollbar space-y-2 lg:space-y-3 max-h-[300px] lg:max-h-none">
                    {colTodos.map((todo) => (
                        <div
                            key={todo.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, todo.id)}
                            className="bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700/50 hover:border-indigo-500/50 rounded-lg lg:rounded-xl p-3 lg:p-4 cursor-grab active:cursor-grabbing group transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded border ${getPriorityColor(todo.priority)}`}>
                                    {todo.priority}
                                </span>
                                <div className="flex items-center gap-1">
                                    {hasUnsavedChanges(todo.id) && (
                                        <button 
                                            onClick={() => handleSave(todo.id)}
                                            className="text-emerald-400 hover:text-emerald-300 transition-colors p-1 bg-emerald-500/10 rounded"
                                            title="Speichern"
                                        >
                                            <Save className="w-4 h-4" />
                                        </button>
                                    )}
                                    <button 
                                        onClick={() => onDeleteToDo(todo.id)}
                                        className="text-slate-600 hover:text-red-400 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            
                            <input 
                                value={localEdits[todo.id]?.title ?? todo.title}
                                onChange={(e) => handleLocalChange(todo.id, 'title', e.target.value)}
                                className="bg-transparent text-white font-medium w-full mb-1 focus:outline-none focus:border-b border-indigo-500 text-sm lg:text-base"
                                placeholder="Titel..."
                            />
                            
                            <textarea 
                                value={localEdits[todo.id]?.description ?? todo.description}
                                onChange={(e) => handleLocalChange(todo.id, 'description', e.target.value)}
                                className="bg-transparent text-xs lg:text-sm text-slate-400 w-full resize-none focus:outline-none min-h-[30px] lg:min-h-[40px]"
                                placeholder="Beschreibung..."
                            />

                            <div className="mt-2 lg:mt-3 pt-2 lg:pt-3 border-t border-slate-700/50 flex items-center justify-between text-xs text-slate-500">
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    <input 
                                        type="date"
                                        value={todo.dueDate ? new Date(todo.dueDate).toISOString().split('T')[0] : ''}
                                        onChange={(e) => onUpdateToDo(todo.id, { dueDate: e.target.value ? new Date(e.target.value).toISOString() : null })}
                                        className="bg-transparent text-slate-400 hover:text-white focus:text-white cursor-pointer focus:outline-none border-none text-xs"
                                        style={{ colorScheme: 'dark' }}
                                    />
                                </div>
                                <div className="hidden lg:flex items-center gap-1 text-slate-600">
                                    <GripVertical className="w-4 h-4" />
                                </div>
                            </div>
                        </div>
                    ))}
                    {colTodos.length === 0 && (
                        <div className="h-16 lg:h-24 border-2 border-dashed border-slate-800 rounded-lg lg:rounded-xl flex items-center justify-center text-slate-600 text-xs lg:text-sm italic">
                            Hierhin ziehen
                        </div>
                    )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
