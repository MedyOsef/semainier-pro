import { useRef } from 'react';
import {
  Settings,
  Briefcase,
  Plus,
  Pencil,
  Trash2,
  Download,
  Upload,
  BarChart3,
  AlertTriangle,
  RotateCcw,
  TrendingUp,
} from 'lucide-react';
import { useStore } from '@/store/useStore';

export function AdminView() {
  const { tasks, clients, collaborators, openModal, exportData, importData, resetTasks, resetClients, resetCollaborators, deleteClient } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) {
        importData(ev.target.result as string);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const confirmAction = (title: string, message: string, action: () => void) => {
    openModal('confirmation', {
      confirmation: { title, message, onConfirm: action },
    });
  };

  const overdueCount = tasks.filter((t) => t.deadline && new Date(t.deadline) < new Date() && t.status !== 'Terminé').length;

  const phases = [
    { num: 1, title: 'Semainier Annuel', status: 'Actif', col: 'var(--success)', desc: 'Planning hebdomadaire intelligent avec gestion complète des tâches, collaborateurs et KPI' },
    { num: 2, title: 'Gestion Cabinet', status: 'À venir', col: 'var(--warning)', desc: 'Facturation, devis, suivi temps passé, archives clients' },
    { num: 3, title: 'Intégration ERP', status: 'Planifié', col: 'var(--terracotta-mid)', desc: 'Comptabilité, trésorerie, achats/ventes, reporting avancé' },
    { num: 4, title: 'Collaboration', status: 'Vision', col: 'var(--terracotta)', desc: 'Chat équipe, vidéo, partage fichiers, gestion projets' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-semibold flex items-center gap-2 mb-6">
        <Settings size={18} /> Administration
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Clients card */}
        <div className="card-surface p-5">
          <h3 className="text-sm font-bold flex items-center gap-2 mb-4">
            <Briefcase size={16} /> Entreprises clientes
          </h3>
          <button
            className="btn-primary btn-sm mb-4"
            onClick={() => openModal('client', { client: null })}
          >
            <Plus size={14} /> Ajouter une entreprise
          </button>
          <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto">
            {clients.map((c) => (
              <div
                key={c.id}
                className="flex items-center gap-3 p-3 rounded-lg"
                style={{ background: 'var(--cream)' }}
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                  style={{ background: 'rgba(79,110,247,0.1)', color: '#4f6ef7' }}
                >
                  {c.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate">{c.name}</div>
                  <div className="text-[10px] text-[var(--txt2)]">{c.type} · {c.secteur}</div>
                </div>
                <div className="flex gap-1">
                  <button
                    className="icon-btn w-7 h-7"
                    onClick={() => openModal('client', { client: { ...c } })}
                  >
                    <Pencil size={12} />
                  </button>
                  <button
                    className="icon-btn w-7 h-7 hover:bg-red-50 hover:text-red-500"
                    onClick={() => { if (confirm('Supprimer cette entreprise ?')) deleteClient(c.id); }}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Backup card */}
        <div className="card-surface p-5">
          <h3 className="text-sm font-bold flex items-center gap-2 mb-4">
            <Download size={16} /> Sauvegarde & Export
          </h3>
          <div className="flex flex-col gap-2">
            <button className="btn-primary" onClick={exportData}>
              <Download size={14} /> Exporter les données
            </button>
            <button className="btn-secondary" onClick={() => fileInputRef.current?.click()}>
              <Upload size={14} /> Importer des données
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleImport}
            />
            <p className="text-xs text-[var(--txt2)] mt-1">
              Les données sont sauvegardées automatiquement toutes les 60 secondes.
            </p>
          </div>
        </div>

        {/* Global stats card */}
        <div className="card-surface p-5">
          <h3 className="text-sm font-bold flex items-center gap-2 mb-4">
            <BarChart3 size={16} /> Statistiques globales
          </h3>
          {[
            { label: 'Total tâches', value: tasks.length },
            { label: 'Terminées', value: tasks.filter((t) => t.status === 'Terminé').length, color: 'var(--success)' },
            { label: 'En cours', value: tasks.filter((t) => t.status === 'En cours').length, color: 'var(--warning)' },
            { label: 'En retard', value: overdueCount, color: 'var(--error)' },
            { label: 'Entreprises', value: clients.length },
            { label: 'Collaborateurs', value: collaborators.length },
            { label: 'Heures planifiées', value: `${tasks.reduce((s, t) => s + (t.duration || 0), 0)}h` },
          ].map((s, i) => (
            <div
              key={i}
              className="flex justify-between items-center py-2 border-b last:border-b-0"
              style={{ borderColor: 'var(--bor)' }}
            >
              <span className="text-xs text-[var(--txt2)]">{s.label}</span>
              <strong className="text-base font-bold" style={{ color: s.color || 'var(--txt)' }}>{s.value}</strong>
            </div>
          ))}
        </div>

        {/* Danger zone card */}
        <div
          className="card-surface p-5"
          style={{ borderColor: 'rgba(196,90,74,0.3)', background: 'rgba(196,90,74,0.03)' }}
        >
          <h3 className="text-sm font-bold flex items-center gap-2 mb-4" style={{ color: 'var(--error)' }}>
            <AlertTriangle size={16} /> Zone dangereuse
          </h3>
          <div className="flex flex-col gap-2">
            <button
              className="btn-destructive"
              onClick={() =>
                confirmAction(
                  'Supprimer toutes les tâches',
                  'Êtes-vous sûr de vouloir supprimer TOUTES les tâches ? Cette action est irréversible.',
                  resetTasks
                )
              }
            >
              <Trash2 size={14} /> Supprimer toutes les tâches
            </button>
            <button
              className="btn-secondary"
              onClick={() =>
                confirmAction(
                  'Réinitialiser les entreprises',
                  'Réinitialiser la liste des entreprises aux valeurs par défaut ?',
                  resetClients
                )
              }
            >
              <RotateCcw size={14} /> Réinitialiser les entreprises
            </button>
            <button
              className="btn-secondary"
              onClick={() =>
                confirmAction(
                  'Réinitialiser les collaborateurs',
                  'Réinitialiser la liste des collaborateurs aux valeurs par défaut ?',
                  resetCollaborators
                )
              }
            >
              <RotateCcw size={14} /> Réinitialiser les collaborateurs
            </button>
          </div>
        </div>
      </div>

      {/* Roadmap */}
      <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
        <TrendingUp size={14} /> Feuille de route
      </h3>
      <div className="flex flex-col gap-3">
        {phases.map((p) => (
          <div key={p.num} className="card-surface p-5 flex items-start gap-4">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
              style={{ background: p.col }}
            >
              P{p.num}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-base font-bold">{p.title}</span>
                <span
                  className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full"
                  style={{ background: `${p.col}20`, color: p.col }}
                >
                  {p.status}
                </span>
              </div>
              <p className="text-xs text-[var(--txt2)]">{p.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
