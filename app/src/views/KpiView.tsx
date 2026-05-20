import { useEffect, useRef } from 'react';
import { AlertTriangle } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { Toolbar } from '@/components/Toolbar';
import gsap from 'gsap';

export function KpiView() {
  const { tasks, collaborators } = useStore();
  const barsRef = useRef<HTMLDivElement>(null);

  const kpiData = collaborators.map((collab) => {
    const assigned = tasks.filter((t) => t.assignedTo.includes(collab.id));
    const completed = assigned.filter((t) => t.status === 'Terminé');
    const inProgress = assigned.filter((t) => t.status === 'En cours');
    const todo = assigned.filter((t) => t.status === 'À faire');
    const totalHours = assigned.reduce((s, t) => s + (t.duration || 0), 0);
    const completedHours = completed.reduce((s, t) => s + (t.duration || 0), 0);
    const rate = assigned.length > 0 ? Math.round((completed.length / assigned.length) * 100) : 0;
    const now = new Date();
    const overdue = assigned.filter((t) => t.deadline && new Date(t.deadline) < now && t.status !== 'Terminé').length;
    return { collab, totalTasks: assigned.length, completedTasks: completed.length, inProgressTasks: inProgress.length, todoTasks: todo.length, totalHours, completedHours, rate, overdue };
  });

  useEffect(() => {
    if (!barsRef.current) return;
    const bars = barsRef.current.querySelectorAll('.kpi-progress-bar');
    gsap.fromTo(
      bars,
      { width: '0%' },
      { width: (_i: number, el: HTMLElement) => el.getAttribute('data-width') || '0%', duration: 0.8, stagger: 0.1, ease: 'power2.out', delay: 0.2 }
    );
  }, []);

  const getRateColor = (rate: number) => {
    if (rate >= 80) return 'var(--success)';
    if (rate >= 50) return 'var(--warning)';
    return 'var(--error)';
  };

  return (
    <div>
      <Toolbar
        title="KPI Collaborateurs"
        subtitle="Indicateurs de performance de l'équipe"
        showSuggestions={false}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5" ref={barsRef}>
        {kpiData.map((k) => {
          const initials = k.collab.name.split(' ').map((n) => n[0]).join('').toUpperCase();
          const rateColor = getRateColor(k.rate);

          return (
            <div key={k.collab.id} className="card-surface p-6">
              {/* Header */}
              <div className="flex items-center gap-4 pb-4 mb-5 border-b" style={{ borderColor: 'var(--bor)' }}>
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-base font-bold shrink-0"
                  style={{ background: `${k.collab.color}18`, color: k.collab.color }}
                >
                  {initials}
                </div>
                <div>
                  <h3 className="text-base font-semibold">{k.collab.name}</h3>
                  <p className="text-xs text-[var(--txt2)]">{k.collab.role}</p>
                </div>
              </div>

              {/* Completion rate */}
              <div className="mb-5">
                <div className="text-[11px] font-semibold uppercase text-[var(--txt2)] tracking-wider mb-2">
                  Taux d'achèvement
                </div>
                <div className="text-3xl font-bold mb-2" style={{ color: rateColor }}>{k.rate}%</div>
                <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'var(--cream)' }}>
                  <div
                    className="kpi-progress-bar h-full rounded-full"
                    style={{ background: rateColor }}
                    data-width={`${k.rate}%`}
                  />
                </div>
              </div>

              {/* Stat pairs */}
              <div className="grid grid-cols-2 gap-4">
                <div className="pl-3" style={{ borderLeft: '3px solid var(--txt)' }}>
                  <div className="text-[11px] font-semibold uppercase text-[var(--txt2)] tracking-wider">Total tâches</div>
                  <div className="text-xl font-bold">{k.totalTasks}</div>
                </div>
                <div className="pl-3" style={{ borderLeft: '3px solid var(--success)' }}>
                  <div className="text-[11px] font-semibold uppercase text-[var(--txt2)] tracking-wider">Terminées</div>
                  <div className="text-xl font-bold" style={{ color: 'var(--success)' }}>{k.completedTasks}</div>
                </div>
                <div className="pl-3" style={{ borderLeft: '3px solid var(--warning)' }}>
                  <div className="text-[11px] font-semibold uppercase text-[var(--txt2)] tracking-wider">En cours</div>
                  <div className="text-xl font-bold" style={{ color: 'var(--warning)' }}>{k.inProgressTasks}</div>
                </div>
                <div className="pl-3" style={{ borderLeft: '3px solid var(--txt)' }}>
                  <div className="text-[11px] font-semibold uppercase text-[var(--txt2)] tracking-wider">À faire</div>
                  <div className="text-xl font-bold">{k.todoTasks}</div>
                </div>
                <div className="pl-3" style={{ borderLeft: '3px solid var(--txt)' }}>
                  <div className="text-[11px] font-semibold uppercase text-[var(--txt2)] tracking-wider">Heures planifiées</div>
                  <div className="text-xl font-bold">{k.totalHours}h</div>
                </div>
                <div className="pl-3" style={{ borderLeft: '3px solid var(--success)' }}>
                  <div className="text-[11px] font-semibold uppercase text-[var(--txt2)] tracking-wider">Heures effectuées</div>
                  <div className="text-xl font-bold" style={{ color: 'var(--success)' }}>{k.completedHours}h</div>
                </div>
              </div>

              {k.overdue > 0 && (
                <div
                  className="mt-4 p-3 rounded-lg flex items-center gap-2"
                  style={{ background: 'rgba(196,90,74,0.05)' }}
                >
                  <AlertTriangle size={14} style={{ color: 'var(--error)' }} />
                  <span className="text-xs text-[var(--txt2)]">Tâches en retard</span>
                  <span className="text-sm font-bold ml-auto" style={{ color: 'var(--error)' }}>{k.overdue}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
