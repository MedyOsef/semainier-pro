import { Clock, Calendar, Briefcase, CheckSquare, Square, Pencil, Trash2 } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { CAT_COLORS } from '@/types';
import type { Task } from '@/types';
import { formatDate, parseKey } from '@/lib/dateUtils';
import { CategoryBadge } from './CategoryBadge';
import { PriorityDot } from './PriorityDot';

interface Props {
  task: Task;
  draggable?: boolean;
}

export function TaskCard({ task, draggable = true }: Props) {
  const { clients, collaborators, toggleStatus, deleteTask, openModal } = useStore();
  const client = clients.find((c) => c.id === task.client);
  const assignedCollabs = task.assignedTo
    .map((cid) => collaborators.find((c) => c.id === cid))
    .filter(Boolean);
  const borderColor = task.color || CAT_COLORS[task.category];

  const handleDragStart = (e: React.DragEvent) => {
    if (!draggable) return;
    e.dataTransfer.setData('taskId', task.id);
    e.dataTransfer.effectAllowed = 'move';
    (e.currentTarget as HTMLElement).style.opacity = '0.5';
    (e.currentTarget as HTMLElement).style.transform = 'rotate(2deg)';
  };

  const handleDragEnd = (e: React.DragEvent) => {
    (e.currentTarget as HTMLElement).style.opacity = '1';
    (e.currentTarget as HTMLElement).style.transform = '';
  };

  const handleEdit = () => {
    openModal('task', { task: { ...task } });
  };

  return (
    <div
      className="rounded-xl p-3.5 cursor-grab active:cursor-grabbing transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
      style={{
        background: 'var(--bg2)',
        border: '1px solid var(--bor)',
        borderLeft: `3px solid ${borderColor}`,
        borderTopLeftRadius: '3px',
      }}
      draggable={draggable}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex justify-between items-center mb-1.5">
        <CategoryBadge category={task.category} />
        <PriorityDot priority={task.priority} />
      </div>

      <div
        className="text-sm font-semibold mb-1 cursor-pointer hover:text-[var(--terracotta)] transition-colors"
        onClick={handleEdit}
      >
        {task.title}
      </div>

      {task.description && (
        <div className="text-xs text-[var(--txt2)] mb-2 line-clamp-2">{task.description}</div>
      )}

      <div className="flex flex-wrap gap-2 text-[10px] text-[var(--txt2)] mb-2">
        {task.startTime && (
          <span className="flex items-center gap-1">
            <Clock size={10} /> {task.startTime}
          </span>
        )}
        {task.duration > 0 && (
          <span className="flex items-center gap-1">
            <Clock size={10} /> {task.duration}h
          </span>
        )}
        {task.deadline && (
          <span className="flex items-center gap-1">
            <Calendar size={10} /> {formatDate(parseKey(task.deadline), 'mini')}
          </span>
        )}
      </div>

      {client && (
        <div className="flex items-center gap-1 text-[10px] text-[var(--txt2)] mb-2">
          <Briefcase size={10} /> {client.name}
        </div>
      )}

      {assignedCollabs.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {assignedCollabs.map((c) =>
            c ? (
              <span
                key={c.id}
                className="text-[11px] font-medium px-1.5 py-0.5 rounded"
                style={{ background: `${c.color}18`, color: c.color }}
              >
                {c.name.split(' ')[0]}
              </span>
            ) : null
          )}
        </div>
      )}

      <div className="flex gap-1 pt-2 border-t" style={{ borderColor: 'var(--bor)' }}>
        <button
          className="icon-btn w-7 h-7"
          onClick={() => toggleStatus(task.id)}
          title="Changer statut"
        >
          {task.status === 'Terminé' ? (
            <CheckSquare size={14} style={{ color: 'var(--success)' }} />
          ) : (
            <Square size={14} />
          )}
        </button>
        <button className="icon-btn w-7 h-7" onClick={handleEdit} title="Modifier">
          <Pencil size={14} />
        </button>
        <button
          className="icon-btn w-7 h-7 hover:bg-red-50 hover:text-red-500"
          onClick={() => {
            if (confirm('Supprimer cette tâche ?')) deleteTask(task.id);
          }}
          title="Supprimer"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
