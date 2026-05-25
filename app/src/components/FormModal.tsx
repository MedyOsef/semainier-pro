import { useEffect, useRef, useCallback, useMemo } from 'react';
import { X, Plus, Clock, Bell, AlertTriangle } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { CATEGORIES, PRIORITIES, STATUSES } from '@/types';
import type { Task } from '@/types';
import { SUGGESTIONS } from '@/lib/data';
import type { Category, Priority } from '@/types';
import { CategoryBadge } from './CategoryBadge';
import { PriorityDot } from './PriorityDot';
import { randomColor } from '@/lib/utils';

export function FormModal() {
  const { modal, editData, closeModal } = useStore();
  const overlayRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') closeModal();
  }, [closeModal]);

  useEffect(() => {
    if (modal) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [modal, handleKeyDown]);

  if (!modal) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) closeModal();
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[60] flex items-center justify-center"
      style={{ background: 'rgba(29,33,68,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={handleOverlayClick}
    >
      <div
        className="rounded-[20px] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-modal-in"
        style={{
          background: 'var(--off-white)',
          width: '90%',
          maxWidth: modal === 'task' || modal === 'suggestions' ? '800px' : '520px',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b" style={{ borderColor: 'var(--bor)' }}>
          <h3 className="text-lg font-semibold">
            {modal === 'task' && (editData.task ? 'Modifier la tâche' : 'Nouvelle tâche')}
            {modal === 'client' && (editData.client ? "Modifier l'entreprise" : 'Nouvelle entreprise')}
            {modal === 'collaborateur' && (editData.collaborator ? 'Modifier le collaborateur' : 'Nouveau collaborateur')}
            {modal === 'suggestions' && 'Suggestions intelligentes'}
            {modal === 'notifs' && 'Notifications'}
            {modal === 'confirmation' && editData.confirmation?.title}
          </h3>
          <button onClick={closeModal} className="icon-btn">
            <X size={17} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 overflow-y-auto flex-1">
          {modal === 'task' && <TaskForm task={editData.task} onClose={closeModal} />}
          {modal === 'client' && <ClientForm client={editData.client} onClose={closeModal} />}
          {modal === 'collaborateur' && <CollaboratorForm collaborator={editData.collaborator} onClose={closeModal} />}
          {modal === 'suggestions' && <SuggestionsView onClose={closeModal} />}
          {modal === 'notifs' && <NotificationsView />}
          {modal === 'confirmation' && editData.confirmation && (
            <ConfirmationView
              message={editData.confirmation.message}
              onConfirm={() => {
                editData.confirmation?.onConfirm();
                closeModal();
              }}
              onCancel={closeModal}
            />
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Task Form ─── */
function TaskForm({ task, onClose }: { task: Task | null; onClose: () => void }) {
  const { clients, collaborators, addTask, updateTask } = useStore();
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;
    const fd = new FormData(formRef.current);
    const title = (fd.get('title') as string) || '';
    if (!title.trim()) return;

    const assignedEls = formRef.current.querySelectorAll<HTMLInputElement>('input[name="assignedTo"]:checked');
    const assignedTo = Array.from(assignedEls).map((el) => el.value);

    const data: Omit<Task, 'id'> = {
      title: title.trim(),
      description: (fd.get('description') as string) || '',
      date: (fd.get('date') as string) || new Date().toISOString().slice(0, 10),
      category: (fd.get('category') as Task['category']) || 'Comptabilité',
      priority: (fd.get('priority') as Task['priority']) || 'Moyenne',
      status: (fd.get('status') as Task['status']) || 'À faire',
      duration: parseFloat((fd.get('duration') as string) || '1') || 1,
      client: (fd.get('client') as string) || '',
      deadline: (fd.get('deadline') as string) || '',
      recurrence: (fd.get('recurrence') as Task['recurrence']) || 'aucune',
      color: (fd.get('color') as string) || '#4f6ef7',
      startTime: (fd.get('startTime') as string) || '',
      assignedTo,
    };

    if (task && task.id) {
      updateTask({ ...task, ...data });
    } else {
      addTask(data);
    }
    onClose();
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="text-[11px] font-semibold uppercase text-[var(--txt2)] mb-1.5 block">Titre *</label>
          <input name="title" defaultValue={task?.title || ''} placeholder="Nom de la tâche..." className="input-field" required />
        </div>
        <div>
          <label className="text-[11px] font-semibold uppercase text-[var(--txt2)] mb-1.5 block">Catégorie</label>
          <select name="category" defaultValue={task?.category || 'Comptabilité'} className="input-field">
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="text-[11px] font-semibold uppercase text-[var(--txt2)] mb-1.5 block">Priorité</label>
          <select name="priority" defaultValue={task?.priority || 'Moyenne'} className="input-field">
            {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="text-[11px] font-semibold uppercase text-[var(--txt2)] mb-1.5 block">Description</label>
        <textarea name="description" rows={2} defaultValue={task?.description || ''} placeholder="Description optionnelle..." className="input-field resize-y" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-[11px] font-semibold uppercase text-[var(--txt2)] mb-1.5 block">Date</label>
          <input name="date" type="date" defaultValue={task?.date || new Date().toISOString().slice(0, 10)} className="input-field" />
        </div>
        <div>
          <label className="text-[11px] font-semibold uppercase text-[var(--txt2)] mb-1.5 block">Heure de début</label>
          <input name="startTime" type="time" defaultValue={task?.startTime || ''} className="input-field" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-[11px] font-semibold uppercase text-[var(--txt2)] mb-1.5 block">Statut</label>
          <select name="status" defaultValue={task?.status || 'À faire'} className="input-field">
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="text-[11px] font-semibold uppercase text-[var(--txt2)] mb-1.5 block">Durée (h)</label>
          <input name="duration" type="number" min="0.5" step="0.5" defaultValue={task?.duration || 1} className="input-field" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-[11px] font-semibold uppercase text-[var(--txt2)] mb-1.5 block">Échéance</label>
          <input name="deadline" type="date" defaultValue={task?.deadline || ''} className="input-field" />
        </div>
        <div>
          <label className="text-[11px] font-semibold uppercase text-[var(--txt2)] mb-1.5 block">Récurrence</label>
          <select name="recurrence" defaultValue={task?.recurrence || 'aucune'} className="input-field">
            <option value="aucune">Aucune</option>
            <option value="hebdo">Hebdomadaire</option>
            <option value="mensuel">Mensuel</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-[11px] font-semibold uppercase text-[var(--txt2)] mb-1.5 block">Client</label>
          <select name="client" defaultValue={task?.client || ''} className="input-field">
            <option value="">— Aucun —</option>
            {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="text-[11px] font-semibold uppercase text-[var(--txt2)] mb-1.5 block">Couleur</label>
          <input name="color" type="color" defaultValue={task?.color || '#4f6ef7'} className="input-field h-[38px] p-1 cursor-pointer" />
        </div>
      </div>

      <div>
        <label className="text-[11px] font-semibold uppercase text-[var(--txt2)] mb-2 block">Collaborateurs assignés</label>
        <div className="grid grid-cols-2 gap-2">
          {collaborators.map((c) => (
            <label key={c.id} className="flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-[var(--cream)] transition-colors">
              <input
                type="checkbox"
                name="assignedTo"
                value={c.id}
                defaultChecked={task?.assignedTo?.includes(c.id)}
                className="accent-[var(--primary)]"
              />
              <span className="text-xs font-medium" style={{ color: c.color }}>{c.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t" style={{ borderColor: 'var(--bor)' }}>
        <button type="button" className="btn-secondary" onClick={onClose}>Annuler</button>
        <button type="submit" className="btn-primary">
          <Plus size={14} /> {task ? 'Mettre à jour' : 'Créer'}
        </button>
      </div>
    </form>
  );
}

/* ─── Client Form ─── */
function ClientForm({ client, onClose }: { client: import('@/types').Client | null; onClose: () => void }) {
  const { addClient, updateClient } = useStore.getState();
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;
    const fd = new FormData(formRef.current);
    const name = (fd.get('name') as string).trim();
    if (!name) return;
    const data = { name, type: (fd.get('type') as string) || 'Entreprise', secteur: (fd.get('secteur') as string) || '' };
    if (client) {
      updateClient({ ...client, ...data });
    } else {
      addClient(data);
    }
    onClose();
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="text-[11px] font-semibold uppercase text-[var(--txt2)] mb-1.5 block">Nom de l'entreprise *</label>
        <input name="name" defaultValue={client?.name || ''} placeholder="Ex: SARL Solutions Tech..." className="input-field" required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-[11px] font-semibold uppercase text-[var(--txt2)] mb-1.5 block">Type</label>
          <select name="type" defaultValue={client?.type || 'Entreprise'} className="input-field">
            {['Entreprise', 'SARL', 'SA', 'SAS', 'SASU', 'Groupe', 'Association', 'Autre'].map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-[11px] font-semibold uppercase text-[var(--txt2)] mb-1.5 block">Secteur</label>
          <input name="secteur" defaultValue={client?.secteur || ''} placeholder="Ex: Technologie..." className="input-field" />
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-4 border-t" style={{ borderColor: 'var(--bor)' }}>
        <button type="button" className="btn-secondary" onClick={onClose}>Annuler</button>
        <button type="submit" className="btn-primary">Enregistrer</button>
      </div>
    </form>
  );
}

/* ─── Collaborator Form ─── */
function CollaboratorForm({ collaborator, onClose }: { collaborator: import('@/types').Collaborator | null; onClose: () => void }) {
  const { addCollaborator, updateCollaborator } = useStore.getState();
  const formRef = useRef<HTMLFormElement>(null);
  const initialColor = useMemo(() => collaborator?.color || randomColor(), [collaborator]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;
    const fd = new FormData(formRef.current);
    const name = (fd.get('name') as string).trim();
    if (!name) return;
    const data = {
      name,
      role: (fd.get('role') as string) || '',
      email: (fd.get('email') as string) || '',
      color: (fd.get('color') as string) || '#4f6ef7',
    };
    if (collaborator) {
      updateCollaborator({ ...collaborator, ...data });
    } else {
      addCollaborator(data);
    }
    onClose();
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="text-[11px] font-semibold uppercase text-[var(--txt2)] mb-1.5 block">Nom complet *</label>
        <input name="name" defaultValue={collaborator?.name || ''} placeholder="Ex: Amosse A...." className="input-field" required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-[11px] font-semibold uppercase text-[var(--txt2)] mb-1.5 block">Fonction</label>
          <input name="role" defaultValue={collaborator?.role || ''} placeholder="Ex: Expert-comptable..." className="input-field" />
        </div>
        <div>
          <label className="text-[11px] font-semibold uppercase text-[var(--txt2)] mb-1.5 block">Email</label>
          <input name="email" type="email" defaultValue={collaborator?.email || ''} placeholder="email@cabinet.ci" className="input-field" />
        </div>
      </div>
      <div>
        <label className="text-[11px] font-semibold uppercase text-[var(--txt2)] mb-1.5 block">Couleur</label>
        <input name="color" type="color" defaultValue={initialColor} className="input-field h-[38px] p-1 cursor-pointer" />
      </div>
      <div className="flex justify-end gap-3 pt-4 border-t" style={{ borderColor: 'var(--bor)' }}>
        <button type="button" className="btn-secondary" onClick={onClose}>Annuler</button>
        <button type="submit" className="btn-primary">Enregistrer</button>
      </div>
    </form>
  );
}

/* ─── Suggestions View ─── */
function SuggestionsView({ onClose }: { onClose: () => void }) {
  const { applySuggestion } = useStore.getState();

  return (
    <>
      <p className="text-xs text-[var(--txt2)] mb-4">Tâches recommandées selon les pratiques comptables ivoiriennes</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {SUGGESTIONS.map((s: { title: string; category: Category; priority: Priority; duration: number; desc: string }, i: number) => (
          <div
            key={i}
            className="card-surface p-3.5 flex flex-col gap-2 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
          >
            <div className="flex items-center gap-2">
              <CategoryBadge category={s.category} />
              <PriorityDot priority={s.priority} />
            </div>
            <div className="text-sm font-semibold">{s.title}</div>
            <div className="text-xs text-[var(--txt2)] flex-1">{s.desc}</div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-[var(--txt2)] flex items-center gap-1">
                <Clock size={10} /> {s.duration}h estimée
              </span>
              <button
                className="btn-primary btn-sm"
                onClick={() => { applySuggestion(i); onClose(); }}
              >
                <Plus size={12} /> Ajouter
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

/* ─── Notifications View ─── */
function NotificationsView() {
  const { notifications, clearNotifications } = useStore();

  return (
    <>
      {notifications.length === 0 ? (
        <div className="text-center py-10 text-[var(--txt2)]">
          <Bell size={28} className="mx-auto mb-2 opacity-40" />
          <span className="text-sm">Aucune notification</span>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto">
            {notifications.map((n) => (
              <div
                key={n.id}
                className="flex items-center justify-between px-3 py-2.5 rounded-lg"
                style={{
                  background: n.type === 'success' ? 'rgba(90,155,125,0.08)' : n.type === 'error' ? 'rgba(196,90,74,0.08)' : 'rgba(79,110,247,0.08)',
                  borderLeft: `3px solid ${n.type === 'success' ? 'var(--success)' : n.type === 'error' ? 'var(--error)' : 'var(--terracotta)'}`,
                }}
              >
                <span className="text-sm">{n.msg}</span>
                <span className="text-[10px] text-[var(--txt2)] opacity-70">{n.time}</span>
              </div>
            ))}
          </div>
          <button className="btn-secondary btn-sm mt-4" onClick={clearNotifications}>
            Tout effacer
          </button>
        </>
      )}
    </>
  );
}

/* ─── Confirmation View ─── */
function ConfirmationView({ message, onConfirm, onCancel }: { message: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3 text-[var(--error)]">
        <AlertTriangle size={24} />
        <p className="text-sm">{message}</p>
      </div>
      <div className="flex justify-end gap-3">
        <button className="btn-secondary" onClick={onCancel}>Annuler</button>
        <button className="btn-destructive" onClick={onConfirm}>Confirmer</button>
      </div>
    </div>
  );
}
