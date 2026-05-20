import { useStore } from '@/store/useStore';
import { JOUR_NOMS, CAT_COLORS, MOIS_NOMS } from '@/types';
import { addDays, startOfWeek, dateKey, isSameDay } from '@/lib/dateUtils';

export function MoisView() {
  const { tasks, currentMonth, setCurrentMonth, openModal } = useStore();
  const today = new Date();
  const { year, month } = currentMonth;

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startW = startOfWeek(firstDay);
  const endW = startOfWeek(lastDay);

  let current = new Date(startW);
  const weeks: Date[][] = [];
  while (current <= endW || weeks.length < 6) {
    const week: Date[] = [];
    for (let i = 0; i < 7; i++) {
      week.push(new Date(current));
      current = addDays(current, 1);
    }
    weeks.push(week);
    if (weeks.length >= 6) break;
  }

  const prevMonth = () => {
    const d = new Date(year, month - 1, 1);
    setCurrentMonth({ year: d.getFullYear(), month: d.getMonth() });
  };
  const nextMonth = () => {
    const d = new Date(year, month + 1, 1);
    setCurrentMonth({ year: d.getFullYear(), month: d.getMonth() });
  };
  const goToday = () => {
    const d = new Date();
    setCurrentMonth({ year: d.getFullYear(), month: d.getMonth() });
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-semibold">{MOIS_NOMS[month]} {year}</h2>
        <div className="flex gap-2">
          <button className="btn-secondary btn-sm" onClick={prevMonth}>Mois préc.</button>
          <button className="btn-secondary btn-sm" onClick={goToday}>Aujourd'hui</button>
          <button className="btn-secondary btn-sm" onClick={nextMonth}>Mois suiv.</button>
        </div>
      </div>

      <div
        className="grid grid-cols-7 gap-px rounded-xl overflow-hidden"
        style={{ background: 'var(--bor)', border: '1px solid var(--bor)' }}
      >
        {JOUR_NOMS.map((d) => (
          <div
            key={d}
            className="text-center py-3 text-[11px] font-semibold uppercase text-[var(--txt2)]"
            style={{ background: 'var(--cream)' }}
          >
            {d.slice(0, 3)}
          </div>
        ))}

        {weeks.map((week, wi) =>
          week.map((d, di) => {
            const dk = dateKey(d);
            const dayTasks = tasks.filter((t) => t.date === dk);
            const isToday = isSameDay(d, today);
            const isCurrentMonth = d.getMonth() === month;
            const totalH = dayTasks.reduce((s, t) => s + (t.duration || 0), 0);
            const doneCount = dayTasks.filter((t) => t.status === 'Terminé').length;
            const catCounts: Record<string, number> = {};
            dayTasks.forEach((t) => { catCounts[t.category] = (catCounts[t.category] || 0) + 1; });
            const topCats = Object.entries(catCounts).sort((a, b) => b[1] - a[1]).slice(0, 2);

            return (
              <div
                key={`${wi}-${di}`}
                className="min-h-[110px] p-2 cursor-pointer transition-colors duration-200"
                style={{
                  background: isToday
                    ? 'rgba(248,236,233,0.5)'
                    : 'var(--bg2)',
                  opacity: isCurrentMonth ? 1 : 0.4,
                  border: isToday ? '2px solid var(--terracotta)' : undefined,
                }}
                onClick={() => {
                  openModal('task', {
                    task: {
                      id: '', title: '', description: '', date: dk,
                      category: 'Comptabilité', priority: 'Moyenne', status: 'À faire',
                      duration: 1, client: '', deadline: '', recurrence: 'aucune',
                      color: '', startTime: '', assignedTo: [],
                    },
                  });
                }}
              >
                <div className="mb-1">
                  {isToday ? (
                    <span
                      className="inline-flex items-center justify-center w-7 h-7 rounded-full text-[13px] font-bold text-white"
                      style={{ background: 'var(--terracotta)' }}
                    >
                      {d.getDate()}
                    </span>
                  ) : (
                    <span className="text-sm font-semibold">{d.getDate()}</span>
                  )}
                </div>

                {dayTasks.slice(0, 2).map((t, i) => (
                  <div
                    key={i}
                    className="text-[10px] px-1.5 py-0.5 rounded mb-0.5 truncate"
                    style={{ background: `${CAT_COLORS[t.category]}18`, color: CAT_COLORS[t.category] }}
                  >
                    {t.title.slice(0, 20)}
                  </div>
                ))}

                {dayTasks.length > 2 && (
                  <div className="text-[10px] text-[var(--txt2)] font-semibold mt-0.5">
                    +{dayTasks.length - 2} tâche{dayTasks.length - 2 > 1 ? 's' : ''}
                  </div>
                )}

                {dayTasks.length > 0 && (
                  <div className="flex items-center gap-1 mt-1 pt-1 flex-wrap" style={{ borderTop: '1px solid var(--bor)' }}>
                    {topCats.map(([cat]) => (
                      <span
                        key={cat}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: CAT_COLORS[cat as keyof typeof CAT_COLORS] }}
                        title={cat}
                      />
                    ))}
                    <span className="text-[9px] text-[var(--txt2)] ml-0.5">
                      {dayTasks.length} · {totalH}h{doneCount > 0 ? ` · ${doneCount}` : ''}
                    </span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
