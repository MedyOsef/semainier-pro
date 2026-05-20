import { useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { AppHeader } from '@/components/AppHeader';
import { ToastContainer } from '@/components/ToastContainer';
import { FormModal } from '@/components/FormModal';
import { SemainierView } from '@/views/SemainierView';
import { MoisView } from '@/views/MoisView';
import { ListeView } from '@/views/ListeView';
import { StatsView } from '@/views/StatsView';
import { EquipeView } from '@/views/EquipeView';
import { KpiView } from '@/views/KpiView';
import { AdminView } from '@/views/AdminView';

function App() {
  const { currentView, darkMode, notify } = useStore();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  // Initial load notification
  useEffect(() => {
    const timer = setTimeout(() => {
      notify('Données chargées', 'info');
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
        e.preventDefault();
        useStore.getState().openModal('task', { task: null });
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
        e.preventDefault();
        const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
        searchInput?.focus();
      }
      if (e.key === 'ArrowLeft' && currentView === 'semainier') {
        const { currentWeekStart, setCurrentWeekStart } = useStore.getState();
        const d = new Date(currentWeekStart);
        d.setDate(d.getDate() - 7);
        setCurrentWeekStart(d);
      }
      if (e.key === 'ArrowRight' && currentView === 'semainier') {
        const { currentWeekStart, setCurrentWeekStart } = useStore.getState();
        const d = new Date(currentWeekStart);
        d.setDate(d.getDate() + 7);
        setCurrentWeekStart(d);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentView]);

  const renderView = () => {
    switch (currentView) {
      case 'semainier': return <SemainierView />;
      case 'mois': return <MoisView />;
      case 'liste': return <ListeView />;
      case 'stats': return <StatsView />;
      case 'equipe': return <EquipeView />;
      case 'kpi': return <KpiView />;
      case 'admin': return <AdminView />;
      default: return <SemainierView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>
      <AppHeader />
      <main
        className="flex-1 py-6 px-4 md:px-8 transition-opacity duration-200"
        style={{ maxWidth: '1400px', margin: '0 auto', width: '100%' }}
      >
        {renderView()}
      </main>
      <FormModal />
      <ToastContainer />
    </div>
  );
}

export default App;
