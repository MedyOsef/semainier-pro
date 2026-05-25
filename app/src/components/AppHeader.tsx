import {
  CalendarDays,
  CalendarRange,
  List,
  BarChart3,
  Users,
  TrendingUp,
  Settings,
  Bell,
  Moon,
  Sun,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import type { ViewName } from '@/types';

const TABS: { id: ViewName; label: string; icon: React.ElementType }[] = [
  { id: 'semainier', label: 'Semainier', icon: CalendarDays },
  { id: 'mois', label: 'Mois', icon: CalendarRange },
  { id: 'liste', label: 'Liste', icon: List },
  { id: 'stats', label: 'Stats', icon: BarChart3 },
  { id: 'equipe', label: 'Équipe', icon: Users },
  { id: 'kpi', label: 'KPI', icon: TrendingUp },
  { id: 'admin', label: 'Admin', icon: Settings },
];

export function AppHeader() {
  const { currentView, setView, darkMode, toggleDarkMode, notifications, openModal } = useStore();

  return (
    <header
      className="sticky top-0 z-50 flex items-center gap-5 h-16 px-4 md:px-8"
      style={{
        background: darkMode ? 'rgba(35,37,56,0.85)' : 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--bor)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 shrink-0">
        <span className="w-2 h-2 rounded-full bg-[var(--terracotta)]" />
        <span className="text-base font-bold text-[var(--txt)]">Semainier Pro</span>
      </div>

      {/* Tabs */}
      <nav className="flex-1 flex justify-center">
        <div
          className="hidden md:flex items-center gap-1 p-1 rounded-xl"
          style={{
            background: darkMode ? 'rgba(42,45,66,0.8)' : 'var(--cream)',
            border: '1px solid var(--bor)',
          }}
        >
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentView === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setView(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-medium uppercase tracking-wider transition-all duration-200 ${
                  isActive
                    ? 'text-white dark:text-[#0f172a]'
                    : 'text-[var(--txt2)] hover:text-[var(--txt)]'
                }`}
                style={isActive ? { background: 'var(--deep-blue)' } : {}}
              >
                <Icon size={15} strokeWidth={1.5} />
                <span className="hidden lg:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Mobile dropdown */}
        <select
          className="md:hidden input-field text-xs py-2"
          value={currentView}
          onChange={(e) => setView(e.target.value as ViewName)}
        >
          {TABS.map((tab) => (
            <option key={tab.id} value={tab.id}>{tab.label}</option>
          ))}
        </select>
      </nav>

      {/* Right actions */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          className="icon-btn relative"
          onClick={() => openModal('notifs')}
          title="Notifications"
        >
          <Bell size={16} />
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-[9px] font-bold text-white">{notifications.length}</span>
            </span>
          )}
        </button>
        <button
          className="icon-btn"
          onClick={toggleDarkMode}
          title={darkMode ? 'Mode clair' : 'Mode sombre'}
        >
          {darkMode ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </header>
  );
}
