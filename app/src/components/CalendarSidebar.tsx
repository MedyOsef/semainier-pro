import { useMemo } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { useStore } from '@/store/useStore';
import { startOfWeek } from '@/lib/dateUtils';

export function CalendarSidebar() {
  const { calendars, toggleCalendarVisibility, currentWeekStart, setCurrentWeekStart } = useStore();

  const selected = currentWeekStart;

  const handleDayClick = (d?: Date) => {
    if (!d) return;
    setCurrentWeekStart(startOfWeek(d));
  };

  const visibleCalendars = useMemo(() => calendars.filter((c) => c.visible), [calendars]);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl p-3 bg-[var(--bg2)]/90 border" style={{ borderColor: 'var(--bor)' }}>
        <DayPicker
          mode="single"
          selected={selected}
          onSelect={handleDayClick}
          fromMonth={new Date()}
        />
      </div>

      <div className="rounded-2xl p-3 bg-[var(--bg2)]/90 border" style={{ borderColor: 'var(--bor)' }}>
        <h4 className="text-sm font-semibold mb-3">Calendriers</h4>
        <div className="flex flex-col gap-2">
          {calendars.map((c) => (
            <label key={c.id} className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={c.visible} onChange={() => toggleCalendarVisibility(c.id)} />
              <span className="w-3 h-3 rounded-full" style={{ background: c.color }} />
              <span className="text-sm">{c.name}</span>
            </label>
          ))}
        </div>
        {visibleCalendars.length === 0 && (
          <div className="text-xs text-[var(--txt2)] mt-3">Aucun calendrier visible</div>
        )}
      </div>

      <div className="rounded-2xl p-3 bg-[var(--bg2)]/90 border" style={{ borderColor: 'var(--bor)' }}>
        <h4 className="text-sm font-semibold mb-3">Raccourcis</h4>
        <button className="btn-secondary w-full mb-2" onClick={() => setCurrentWeekStart(startOfWeek(new Date()))}>Semaine courante</button>
      </div>
    </div>
  );
}
