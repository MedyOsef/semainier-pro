import { Search } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { CATEGORIES, STATUSES } from '@/types';

interface Props {
  showSearch?: boolean;
}

export function FilterBar({ showSearch = true }: Props) {
  const { clients, collaborators, filterCat, filterStatus, filterClient, filterCollab, search, setFilters, clearFilters } = useStore();
  const hasFilters = filterCat || filterStatus || filterClient || filterCollab || search;

  return (
    <div className="card-surface p-4 flex flex-wrap gap-2.5 items-center">
      {showSearch && (
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--txt2)]" />
          <input
            type="text"
            placeholder="Rechercher une tâche..."
            value={search}
            onChange={(e) => setFilters({ search: e.target.value })}
            className="input-field pl-8 min-w-[200px]"
          />
        </div>
      )}

      <select
        value={filterCat}
        onChange={(e) => setFilters({ filterCat: e.target.value })}
        className="input-field text-xs py-2 min-w-[140px]"
      >
        <option value="">Toutes catégories</option>
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      <select
        value={filterStatus}
        onChange={(e) => setFilters({ filterStatus: e.target.value })}
        className="input-field text-xs py-2 min-w-[120px]"
      >
        <option value="">Tous statuts</option>
        {STATUSES.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      <select
        value={filterClient}
        onChange={(e) => setFilters({ filterClient: e.target.value })}
        className="input-field text-xs py-2 min-w-[140px]"
      >
        <option value="">Tous clients</option>
        {clients.map((c) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>

      <select
        value={filterCollab}
        onChange={(e) => setFilters({ filterCollab: e.target.value })}
        className="input-field text-xs py-2 min-w-[150px]"
      >
        <option value="">Tous collaborateurs</option>
        {collaborators.map((c) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>

      {hasFilters && (
        <button
          onClick={clearFilters}
          className="text-xs text-[var(--txt2)] hover:text-[var(--terracotta)] transition-colors"
        >
          Effacer les filtres
        </button>
      )}
    </div>
  );
}
