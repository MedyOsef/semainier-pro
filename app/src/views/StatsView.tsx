import { useEffect, useRef } from 'react';
import { BarChart3, List, Briefcase } from 'lucide-react';
import CountUp from 'react-countup';
import { useStore } from '@/store/useStore';
import { CATEGORIES, CAT_COLORS } from '@/types';
import gsap from 'gsap';

export function StatsView() {
  const { tasks, clients } = useStore();
  const barsRef = useRef<HTMLDivElement>(null);

  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === 'Terminé').length;
  const inProgress = tasks.filter((t) => t.status === 'En cours').length;
  const todo = tasks.filter((t) => t.status === 'À faire').length;
  const totalHours = tasks.reduce((s, t) => s + (t.duration || 0), 0);
  const completedHours = tasks.filter((t) => t.status === 'Terminé').reduce((s, t) => s + (t.duration || 0), 0);

  const byCat: Record<string, { total: number; completed: number; hours: number }> = {};
  CATEGORIES.forEach((c) => {
    const catTasks = tasks.filter((t) => t.category === c);
    byCat[c] = {
      total: catTasks.length,
      completed: catTasks.filter((t) => t.status === 'Terminé').length,
      hours: catTasks.reduce((s, t) => s + (t.duration || 0), 0),
    };
  });

  const byClient = clients
    .map((c) => {
      const ct = tasks.filter((t) => t.client === c.id);
      return {
        client: c,
        total: ct.length,
        completed: ct.filter((t) => t.status === 'Terminé').length,
        hours: ct.reduce((s, t) => s + (t.duration || 0), 0),
      };
    })
    .filter((x) => x.total > 0)
    .sort((a, b) => b.total - a.total);

  useEffect(() => {
    if (!barsRef.current) return;
    const bars = barsRef.current.querySelectorAll('.cat-bar-fill');
    gsap.fromTo(
      bars,
      { width: '0%' },
      { width: (_i: number, el: HTMLElement) => el.getAttribute('data-width') || '0%', duration: 0.6, stagger: 0.05, ease: 'power2.out', delay: 0.2 }
    );
  }, []);

  const statCards = [
    { label: 'Total tâches', value: total, variant: '' as const },
    { label: 'Terminées', value: completed, variant: 'success' as const },
    { label: 'En cours', value: inProgress, variant: 'warning' as const },
    { label: 'À faire', value: todo, variant: '' as const },
    { label: 'Heures planifiées', value: totalHours, variant: '' as const, suffix: 'h' },
    { label: 'Heures effectuées', value: completedHours, variant: 'success' as const, suffix: 'h' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-semibold flex items-center gap-2 mb-6">
        <BarChart3 size={20} /> Statistiques globales
      </h2>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {statCards.map((s, idx) => (
          <div
            key={idx}
            className="card-surface p-6 text-center"
            style={{
              borderTop: s.variant === 'success' ? '3px solid var(--success)' : s.variant === 'warning' ? '3px solid var(--warning)' : '3px solid transparent',
            }}
          >
            <div
              className="text-3xl font-bold"
              style={{
                color: s.variant === 'success' ? 'var(--success)' : s.variant === 'warning' ? 'var(--warning)' : 'var(--txt)',
              }}
            >
              <CountUp end={s.value} duration={1.5} suffix={s.suffix || ''} />
            </div>
            <div className="text-xs font-medium uppercase tracking-wider text-[var(--txt2)] mt-2">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Category breakdown */}
      <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
        <List size={16} /> Par catégorie
      </h3>
      <div className="card-surface p-5 mb-8" ref={barsRef}>
        {CATEGORIES.map((c) => {
          const s = byCat[c];
          const pct = s.total > 0 ? Math.round((s.completed / s.total) * 100) : 0;
          return (
            <div
              key={c}
              className="grid gap-3 items-center py-2.5 border-b last:border-b-0"
              style={{ gridTemplateColumns: '140px 1fr 100px', borderColor: 'var(--bor)' }}
            >
              <span className="text-xs font-semibold" style={{ color: CAT_COLORS[c] }}>{c}</span>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--cream)' }}>
                <div
                  className="cat-bar-fill h-full rounded-full"
                  style={{ background: CAT_COLORS[c], width: `${pct}%` }}
                  data-width={`${pct}%`}
                />
              </div>
              <span className="text-[11px] text-[var(--txt2)] text-right">{s.completed}/{s.total} ({s.hours}h)</span>
            </div>
          );
        })}
      </div>

      {/* Client breakdown */}
      {byClient.length > 0 && (
        <>
          <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <Briefcase size={16} /> Par client
          </h3>
          <div className="flex flex-col gap-3">
            {byClient.map((x) => {
              const pct = x.total > 0 ? Math.round((x.completed / x.total) * 100) : 0;
              return (
                <div key={x.client.id} className="card-surface p-4 flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                    style={{ background: 'rgba(79,110,247,0.1)', color: '#4f6ef7' }}
                  >
                    {x.client.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{x.client.name}</div>
                    <div className="text-xs text-[var(--txt2)]">
                      {x.completed}/{x.total} tâches · {x.hours}h · {pct}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
