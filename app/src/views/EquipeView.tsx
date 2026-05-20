import { Users, Pencil, Trash2 } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { Toolbar } from '@/components/Toolbar';
import { EmptyState } from '@/components/EmptyState';

export function EquipeView() {
  const { tasks, collaborators, openModal, deleteCollaborator } = useStore();

  return (
    <div>
      <Toolbar
        title="Gestion de l'équipe"
        onNewTask={() => openModal('collaborateur', { collaborator: null })}
        showSuggestions={false}
      />

      {collaborators.length === 0 ? (
        <EmptyState message="Aucun collaborateur enregistré" icon={<Users size={48} className="opacity-40" />} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {collaborators.map((c) => {
            const assignedTasks = tasks.filter((t) => t.assignedTo.includes(c.id));
            const completedTasks = assignedTasks.filter((t) => t.status === 'Terminé');
            const initials = c.name.split(' ').map((n) => n[0]).join('').toUpperCase();

            return (
              <div
                key={c.id}
                className="card-surface p-6 flex flex-col items-center gap-4 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold"
                  style={{ background: `${c.color}18`, color: c.color }}
                >
                  {initials}
                </div>

                <div className="text-center">
                  <h3 className="text-base font-semibold">{c.name}</h3>
                  <p className="text-sm text-[var(--txt2)]">{c.role}</p>
                  <p className="text-xs text-[var(--txt2)]">{c.email}</p>
                </div>

                <div
                  className="grid grid-cols-2 gap-3 w-full pt-4 border-t"
                  style={{ borderColor: 'var(--bor)' }}
                >
                  <div className="text-center">
                    <span className="block text-2xl font-bold">{assignedTasks.length}</span>
                    <span className="text-[10px] text-[var(--txt2)] uppercase tracking-wider">Tâches</span>
                  </div>
                  <div className="text-center">
                    <span className="block text-2xl font-bold" style={{ color: 'var(--success)' }}>{completedTasks.length}</span>
                    <span className="text-[10px] text-[var(--txt2)] uppercase tracking-wider">Terminées</span>
                  </div>
                </div>

                <div className="flex gap-2 w-full">
                  <button
                    className="btn-secondary btn-sm flex-1 justify-center"
                    onClick={() => openModal('collaborateur', { collaborator: { ...c } })}
                  >
                    <Pencil size={12} /> Modifier
                  </button>
                  <button
                    className="btn-destructive btn-sm flex-1 justify-center"
                    onClick={() => {
                      if (confirm('Supprimer ce collaborateur ?')) deleteCollaborator(c.id);
                    }}
                  >
                    <Trash2 size={12} /> Supprimer
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
