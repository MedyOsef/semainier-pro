import { useMemo, useState, useCallback } from 'react';
import { useStore } from '@/store/useStore';
import { CAT_COLORS, JOUR_NOMS, type Task } from '@/types';
import { addDays, dateKey, formatDate, isSameDay } from '@/lib/dateUtils';
import { Toolbar } from '@/components/Toolbar';
import { CalendarSidebar } from '@/components/CalendarSidebar';

interface ScheduleEventProps {
  task: Task;
  onClick: () => void;
}

function ScheduleEventCard({ task, onClick }: ScheduleEventProps) {
  const client = task.client ? useStore.getState().clients.find((c) => c.id === task.client) : null;
  const assignedCollabs = task.assignedTo
    .map((id) => useStore.getState().collaborators.find((c) => c.id === id))
    .filter(Boolean);
  const borderColor = task.color || CAT_COLORS[task.category] || 'var(--primary)';

  return (
    <button
      className="w-full text-left rounded-2xl p-3 border transition-all duration-200 hover:shadow-lg"
      style={{
        background: 'var(--bg3)',
        borderColor,
        boxShadow: '0 10px 24px rgba(15, 23, 42, 0.18)',
      }}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--txt2)]">{task.category}</span>
        <span className="text-[10px] uppercase tracking-[0.15em] text-[var(--txt2)]">{task.status}</span>
      </div>
      <div className="text-sm font-semibold text-[var(--txt)] mb-1">{task.title}</div>
      <div className="text-[11px] text-[var(--txt2)] mb-2">{task.startTime || 'Toute la journée'} · {task.duration}h</div>
      {client && (
        <div className="text-[11px] text-[var(--txt2)] mb-2">Client : {client.name}</div>
      )}
      {assignedCollabs.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {assignedCollabs.map((c) => (
            <span
              key={c?.id}
              className="text-[10px] font-medium px-2 py-1 rounded-full"
              style={{ background: `${c?.color}22`, color: c?.color }}
            >
              {c?.name}
            </span>
          ))}
        </div>
      )}
    </button>
  );
}

export function SemainierView() {
  const {
    tasks, moveTask, openModal, currentWeekStart, setCurrentWeekStart,
    filterCat, filterStatus, filterClient, filterCollab, search,
    exportData, importData,
  } = useStore();

  const [dragOverDay, setDragOverDay] = useState<string | null>(null);
  const weekDays = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i)), [currentWeekStart]);
  const today = new Date();

  const hours = useMemo(() => Array.from({ length: 11 }, (_, i) => 8 + i), []);

  const weekTasks = useMemo(() => {
    const start = weekDays[0];
    const end = weekDays[6];
    return tasks
      .filter((task) => {
        const date = task.date;
        return date >= dateKey(start) && date <= dateKey(end);
      })
      .filter((task) => {
        if (!filterCat && !filterStatus && !filterClient && !filterCollab && !search) return true;
        const matchesCategory = filterCat ? task.category === filterCat : true;
        const matchesStatus = filterStatus ? task.status === filterStatus : true;
        const matchesClient = filterClient ? task.client === filterClient : true;
        const matchesCollab = filterCollab ? task.assignedTo.includes(filterCollab) : true;
        const matchesSearch = search
          ? task.title.toLowerCase().includes(search.toLowerCase()) || task.description?.toLowerCase().includes(search.toLowerCase())
          : true;
        return matchesCategory && matchesStatus && matchesClient && matchesCollab && matchesSearch;
      })
      .sort((a, b) => {
        if (a.date !== b.date) return a.date.localeCompare(b.date);
        if (a.startTime && b.startTime) return a.startTime.localeCompare(b.startTime);
        if (a.startTime) return -1;
        if (b.startTime) return 1;
        return a.title.localeCompare(b.title);
      });
  }, [tasks, weekDays, filterCat, filterStatus, filterClient, filterCollab, search]);

  const summaryCards = weekTasks.slice(0, 4);

  const getSlotTasks = useCallback(
    (dayKey: string, hour: number) => {
      return weekTasks.filter((task) => {
        if (task.date !== dayKey) return false;
        if (!task.startTime) return false;
        return Number(task.startTime.split(':')[0]) === hour;
      });
    },
    [weekTasks]
  );

  const getAllDayTasks = useCallback(
    (dayKey: string) => weekTasks.filter((task) => task.date === dayKey && !task.startTime),
    [weekTasks]
  );

  const handleDrop = (e: React.DragEvent, dayKey: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) moveTask(taskId, dayKey);
    setDragOverDay(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const weekLabel = `${formatDate(weekDays[0], 'short')} — ${formatDate(weekDays[6], 'short')}`;

  return (
    <div className="space-y-6">
      <Toolbar
        onNewTask={() => openModal('task', { task: null })}
        onSuggestions={() => openModal('suggestions')}
        weekLabel={weekLabel}
        onPrev={() => setCurrentWeekStart(addDays(currentWeekStart, -7))}
        onNext={() => setCurrentWeekStart(addDays(currentWeekStart, 7))}
        onExport={() => exportData()}
        onImport={(json) => importData(json)}
      />

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {summaryCards.map((task) => (
              <div key={task.id} className="rounded-3xl border p-4 bg-[var(--bg2)] shadow-sm" style={{ borderColor: 'var(--bor)' }}>
                <div className="text-[11px] uppercase tracking-[0.2em] text-[var(--txt2)] mb-2">{formatDate(new Date(task.date), 'mini')}</div>
                <div className="text-sm font-semibold mb-1">{task.title}</div>
                <div className="text-[11px] text-[var(--txt2)]">{task.startTime || 'Sans horaire'} · {task.duration}h</div>
              </div>
            ))}
            {summaryCards.length === 0 && (
              <div className="rounded-3xl border p-4 text-[var(--txt2)] bg-[var(--bg2)]" style={{ borderColor: 'var(--bor)' }}>
                Aucune tâche planifiée cette semaine.
              </div>
            )}
          </div>

          <div className="rounded-[32px] border bg-[var(--bg3)] p-4 shadow-sm" style={{ borderColor: 'var(--bor)' }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-semibold">Planification hebdomadaire</p>
                <p className="text-xs text-[var(--txt2)]">Glissez-déposez pour déplacer les rendez-vous entre les jours.</p>
              </div>
              <button
                className="btn-secondary"
                onClick={() => openModal('task', { task: null })}
              >
                Nouveau rendez-vous
              </button>
            </div>

            <div className="overflow-auto rounded-[28px] border border-[var(--bor)] bg-[var(--bg3)]">
              <div className="grid min-w-[940px] grid-cols-[80px_repeat(7,minmax(0,1fr))]">
                <div className="sticky left-0 top-0 z-10 bg-[var(--bg2)]/85 border-b border-r px-3 py-3 text-[11px] uppercase tracking-[0.22em] text-[var(--txt2)] backdrop-blur">
                  Heure
                </div>
                {weekDays.map((day) => {
                  const isToday = isSameDay(day, today);
                  return (
                    <div
                      key={dateKey(day)}
                      className="sticky top-0 z-10 border-b px-3 py-3 text-[11px] uppercase tracking-[0.18em]"
                      style={{
                        background: isToday ? 'rgba(79,110,247,0.18)' : 'rgba(255,255,255,0.06)',
                        borderColor: 'var(--bor)',
                      }}
                    >
                      <div className="text-xs text-[var(--txt2)]">{JOUR_NOMS[day.getDay()]}</div>
                      <div className="text-sm font-semibold mt-1">{day.getDate()} {formatDate(day, 'short').split(' ')[1]}</div>
                    </div>
                  );
                })}

                <div className="sticky left-0 top-[62px] z-10 bg-[var(--bg2)]/90 border-r px-3 py-2 text-[11px] text-[var(--txt2)]">
                  All-day
                </div>
                {weekDays.map((day) => {
                  const dk = dateKey(day);
                  const dayAllDay = getAllDayTasks(dk);
                  return (
                    <div key={`allday-${dk}`} className="min-h-[80px] border-b border-r p-3 bg-[var(--bg3)]">
                      <div className="space-y-2">
                        {dayAllDay.map((task) => (
                          <ScheduleEventCard
                            key={task.id}
                            task={task}
                            onClick={() => openModal('task', { task: { ...task } })}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}

                {hours.flatMap((hour) => {
                  const label = (
                    <div key={`label-${hour}`} className="border-b border-r px-3 py-3 text-[11px] text-[var(--txt2)] bg-[var(--bg2)]/85">
                      {String(hour).padStart(2, '0')}:00
                    </div>
                  );
                  const cells = weekDays.map((day) => {
                    const dk = dateKey(day);
                    const slotTasks = getSlotTasks(dk, hour);
                    const isDropTarget = dragOverDay === dk;
                    return (
                      <div
                        key={`${dk}-${hour}`}
                        className="min-h-[70px] border-b border-r p-3"
                        style={{
                          background: isDropTarget ? 'rgba(79,110,247,0.14)' : 'transparent',
                        }}
                        onDrop={(e) => handleDrop(e, dk)}
                        onDragOver={(e) => { handleDragOver(e); setDragOverDay(dk); }}
                        onDragLeave={() => setDragOverDay(null)}
                      >
                        <div className="space-y-2">
                          {slotTasks.map((task) => (
                            <ScheduleEventCard
                              key={task.id}
                              task={task}
                              onClick={() => openModal('task', { task: { ...task } })}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  });
                  return [label, ...cells];
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <CalendarSidebar />
        </div>
      </div>
    </div>
  );
}
