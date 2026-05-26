import { Search, Pencil, Trash2, Mail } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { formatDate, parseKey } from '@/lib/dateUtils';
import { Toolbar } from '@/components/Toolbar';
import { FilterBar } from '@/components/FilterBar';
import { CategoryBadge } from '@/components/CategoryBadge';
import { PriorityDot } from '@/components/PriorityDot';
import { StatusBadge } from '@/components/StatusBadge';
import { EmptyState } from '@/components/EmptyState';

export function ListeView() {
  const { tasks, clients, collaborators, search, setFilters, openModal, deleteTask, filterCat, filterStatus, filterClient, filterCollab } = useStore();

  let filtered = [...tasks];
  if (filterCat) filtered = filtered.filter((t) => t.category === filterCat);
  if (filterStatus) filtered = filtered.filter((t) => t.status === filterStatus);
  if (filterClient) filtered = filtered.filter((t) => t.client === filterClient);
  if (filterCollab) filtered = filtered.filter((t) => t.assignedTo.includes(filterCollab));
  if (search) {
    const s = search.toLowerCase();
    filtered = filtered.filter((t) => t.title.toLowerCase().includes(s) || t.description?.toLowerCase().includes(s));
  }
  filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div>
      <Toolbar
        onNewTask={() => openModal('task', { task: null })}
        showSuggestions={false}
      />

      <div className="flex items-center gap-3 mb-4">
        <div className="relative ml-auto">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--txt2)]" />
          <input
            type="text"
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setFilters({ search: e.target.value })}
            className="input-field pl-8 min-w-[200px]"
          />
        </div>
      </div>

      <div className="mb-4">
        <FilterBar showSearch={false} />
      </div>

      <div className="card-surface overflow-hidden">
        <div
          className="grid gap-3 px-5 py-3 text-[11px] font-bold uppercase text-[var(--txt2)]"
          style={{
            gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1.5fr 1.5fr auto',
            background: 'var(--cream)',
          }}
        >
          <div>Tâche</div>
          <div>Catégorie</div>
          <div>Date</div>
          <div>Priorité</div>
          <div>Statut</div>
          <div>Client</div>
          <div>Collaborateurs</div>
          <div>Actions</div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState message="Aucune tâche trouvée" />
        ) : (
          filtered.map((t) => {
            const client = clients.find((c) => c.id === t.client);
            const assigned = t.assignedTo.map((cid) => collaborators.find((c) => c.id === cid)).filter(Boolean);
            return (
              <div
                key={t.id}
                className="grid gap-3 px-5 py-3.5 border-t transition-colors duration-150 hover:bg-[var(--cream)] items-center"
                style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1.5fr 1.5fr auto', borderColor: 'var(--bor)' }}
              >
                <div className="text-sm font-semibold text-[var(--txt)] truncate">{t.title}</div>
                <div><CategoryBadge category={t.category} /></div>
                <div className="text-xs text-[var(--txt2)]">{formatDate(parseKey(t.date), 'short')}</div>
                <div><PriorityDot priority={t.priority} showLabel /></div>
                <div><StatusBadge status={t.status} /></div>
                <div className="text-xs text-[var(--txt2)]">{client ? client.name : '-'}</div>
                <div className="flex flex-wrap gap-1">
                  {assigned.length > 0 ? assigned.map((c) =>
                    c ? (
                      <span key={c.id} className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: `${c.color}18`, color: c.color }}>
                        {c.name.split(' ')[0]}
                      </span>
                    ) : null
                  ) : '-'}
                </div>
                <div className="flex gap-1">
                  <button className="icon-btn w-7 h-7" title="Éditer" onClick={() => openModal('task', { task: { ...t } })}>
                    <Pencil size={13} />
                  </button>
                  {assigned.length > 0 && (
                    <button
                      className="icon-btn w-7 h-7 hover:bg-blue-50 hover:text-blue-500"
                      onClick={() => {
                        const firstAssigned = assigned[0];
                        if (firstAssigned) {
                          openModal('reminder', {
                            reminder: {
                              task: t,
                              collaborator: firstAssigned,
                              message: '',
                            },
                          });
                        }
                      }}
                      title="Relancer ce collaborateur"
                    >
                      <Mail size={13} />
                    </button>
                  )}
                  <button
                    className="icon-btn w-7 h-7 hover:bg-red-50 hover:text-red-500"
                    onClick={() => { if (confirm('Supprimer cette tâche ?')) deleteTask(t.id); }}
                    title="Supprimer"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
