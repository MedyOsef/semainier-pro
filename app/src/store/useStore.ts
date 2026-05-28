import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Task, Client, Collaborator, Notification, ViewName, ModalType, Status, Reminder } from '@/types';
import { sendEmail } from '@/lib/emailService';
import { generateReminderMessage } from '@/lib/reminderMessages';
import { DEFAULT_CLIENTS, DEFAULT_COLLABORATORS, SUGGESTIONS, generateId } from '@/lib/data';
import { getInitialWeek, dateKey } from '@/lib/dateUtils';
import { indexedStorage } from '@/lib/indexedStorage';

interface ReminderData {
  task: Task | null;
  collaborator: Collaborator | null;
  message: string;
}

interface EditData {
  task: Task | null;
  client: Client | null;
  collaborator: Collaborator | null;
  confirmation: { title: string; message: string; onConfirm: () => void } | null;
  reminder: ReminderData | null;
}

interface EmailJsConfig {
  publicKey: string;
  serviceId: string;
  templateId: string;
}

interface AppState {
  // Theme
  darkMode: boolean;
  toggleDarkMode: () => void;

  // Data
  tasks: Task[];
  clients: Client[];
  collaborators: Collaborator[];
  notifications: Notification[];
  reminders: Reminder[];
  calendars: import('../types').Calendar[];

  // Navigation
  currentView: ViewName;
  setView: (v: ViewName) => void;
  currentWeekStart: Date;
  setCurrentWeekStart: (d: Date) => void;
  currentMonth: { year: number; month: number };
  setCurrentMonth: (m: { year: number; month: number }) => void;

  // Filters
  filterCat: string;
  filterStatus: string;
  filterClient: string;
  filterCollab: string;
  search: string;
  setFilters: (f: Partial<Pick<AppState, 'filterCat' | 'filterStatus' | 'filterClient' | 'filterCollab' | 'search'>>) => void;
  clearFilters: () => void;

  // Modal
  modal: ModalType;
  editData: EditData;
  openModal: (type: ModalType, data?: Partial<EditData>) => void;
  closeModal: () => void;

  // Actions - Tasks
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  toggleStatus: (id: string) => void;
  moveTask: (taskId: string, newDate: string) => void;
  applySuggestion: (idx: number) => void;

  // Actions - Clients
  addClient: (client: Omit<Client, 'id'>) => void;
  updateClient: (client: Client) => void;
  deleteClient: (id: string) => void;

  // Actions - Collaborators
  addCollaborator: (c: Omit<Collaborator, 'id'>) => void;
  updateCollaborator: (c: Collaborator) => void;
  deleteCollaborator: (id: string) => void;

  // EmailJS configuration
  emailJsConfig: EmailJsConfig;
  setEmailJsConfig: (config: EmailJsConfig) => void;

  // Actions - Reminders
  sendReminder: (taskId: string, collaboratorId: string, customNote?: string) => Promise<boolean>;

  // Calendars
  addCalendar: (c: Omit<import('../types').Calendar, 'id'>) => void;
  updateCalendar: (c: import('../types').Calendar) => void;
  toggleCalendarVisibility: (id: string) => void;

  // Notifications
  notify: (msg: string, type?: Notification['type']) => void;
  clearNotifications: () => void;

  // Export/Import
  exportData: () => void;
  importData: (json: string) => boolean;
  resetTasks: () => void;
  resetClients: () => void;
  resetCollaborators: () => void;

  // Autosave indicator
  lastSaved: string | null;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      darkMode: false,
      toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),

      tasks: [],
      clients: DEFAULT_CLIENTS,
      collaborators: DEFAULT_COLLABORATORS,
      notifications: [],
      reminders: [],
      emailJsConfig: {
        publicKey: '',
        serviceId: '',
        templateId: '',
      },
      calendars: [
        { id: 'cal_main', name: 'Mon calendrier', color: '#4f6ef7', visible: true },
        { id: 'cal_personnel', name: 'Personnel', color: '#4f6ef7', visible: true },
      ],

      currentView: 'semainier',
      setView: (v) => set({ currentView: v }),
      currentWeekStart: getInitialWeek(),
      setCurrentWeekStart: (d) => set({ currentWeekStart: d }),
      currentMonth: { year: new Date().getFullYear(), month: new Date().getMonth() },
      setCurrentMonth: (m) => set({ currentMonth: m }),

      filterCat: '',
      filterStatus: '',
      filterClient: '',
      filterCollab: '',
      search: '',
      setFilters: (f) => set(f),
      clearFilters: () => set({ filterCat: '', filterStatus: '', filterClient: '', filterCollab: '', search: '' }),

      modal: null,
      editData: { task: null, client: null, collaborator: null, confirmation: null, reminder: null },
      openModal: (type, data) => set({ modal: type, editData: { ...get().editData, ...data } }),
      closeModal: () => set({ modal: null, editData: { task: null, client: null, collaborator: null, confirmation: null, reminder: null } }),

      addTask: (task) => {
        const newTask: Task = { ...task, id: generateId('t') };
        set((s) => ({ tasks: [...s.tasks, newTask] }));
        get().notify('Tâche créée', 'success');
      },
      updateTask: (task) => {
        set((s) => ({ tasks: s.tasks.map((t) => (t.id === task.id ? task : t)) }));
        get().notify('Tâche mise à jour', 'success');
      },
      deleteTask: (id) => {
        set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) }));
        get().notify('Tâche supprimée', 'success');
      },
      toggleStatus: (id) => {
        set((s) => ({
          tasks: s.tasks.map((t) => {
            if (t.id !== id) return t;
            let newStatus: Status;
            if (t.status === 'À faire') newStatus = 'En cours';
            else if (t.status === 'En cours') newStatus = 'Terminé';
            else newStatus = 'À faire';
            return { ...t, status: newStatus };
          }),
        }));
      },
      moveTask: (taskId, newDate) => {
        set((s) => ({
          tasks: s.tasks.map((t) => (t.id === taskId ? { ...t, date: newDate } : t)),
        }));
        get().notify('Tâche déplacée', 'success');
      },
      applySuggestion: (idx) => {
        const s = SUGGESTIONS[idx];
        const newTask: Task = {
          id: generateId('t'),
          title: s.title,
          description: s.desc,
          date: dateKey(new Date()),
          category: s.category,
          priority: s.priority,
          status: 'À faire',
          duration: s.duration,
          client: '',
          deadline: '',
          recurrence: 'aucune',
          color: '',
          startTime: '',
          assignedTo: [],
        };
        set((state) => ({ tasks: [...state.tasks, newTask] }));
        get().notify('Suggestion ajoutée', 'success');
      },

      addClient: (client) => {
        set((s) => ({ clients: [...s.clients, { ...client, id: generateId('c') }] }));
        get().notify('Entreprise ajoutée', 'success');
      },
      updateClient: (client) => {
        set((s) => ({ clients: s.clients.map((c) => (c.id === client.id ? client : c)) }));
        get().notify('Entreprise mise à jour', 'success');
      },
      deleteClient: (id) => {
        set((s) => ({ clients: s.clients.filter((c) => c.id !== id) }));
        get().notify('Entreprise supprimée', 'success');
      },

      addCollaborator: (c) => {
        set((s) => ({ collaborators: [...s.collaborators, { ...c, id: generateId('col') }] }));
        get().notify('Collaborateur ajouté', 'success');
      },
      updateCollaborator: (c) => {
        set((s) => ({ collaborators: s.collaborators.map((x) => (x.id === c.id ? c : x)) }));
        get().notify('Collaborateur mis à jour', 'success');
      },
      deleteCollaborator: (id) => {
        set((s) => ({
          collaborators: s.collaborators.filter((c) => c.id !== id),
          tasks: s.tasks.map((t) =>
            t.assignedTo?.includes(id) ? { ...t, assignedTo: t.assignedTo.filter((x) => x !== id) } : t
          ),
        }));
        get().notify('Collaborateur supprimé', 'success');
      },

      setEmailJsConfig: (config) => set({ emailJsConfig: config }),

      sendReminder: async (taskId, collaboratorId, customNote) => {
        const collaborator = get().collaborators.find((c) => c.id === collaboratorId) || null;
        const task = get().tasks.find((t) => t.id === taskId) || null;
        const client = task?.client ? get().clients.find((c) => c.id === task.client) : null;

        if (!task || !collaborator) {
          get().notify('Erreur: Tâche ou collaborateur introuvable', 'error');
          return false;
        }

        // Générer le message formaté selon le statut
        let emailMessage = generateReminderMessage(task, collaborator, client);
        
        // Ajouter la note personnalisée si elle existe
        if (customNote?.trim()) {
          emailMessage += `\n\n---\nNote personnalisée :\n${customNote}`;
        }

        const to_email = collaborator.email;
        const to_name = collaborator.name;
        const subject = `Relance: ${task.title}`;
        const config = get().emailJsConfig;

        console.debug('sendReminder', {
          collaborator: { id: collaboratorId, email: to_email, name: to_name },
          task: { id: taskId, title: task.title },
          emailJsConfig: { serviceId: config.serviceId, templateId: config.templateId },
        });

        try {
          const result = await sendEmail(
            {
              to_email,
              to_name,
              subject,
              message: emailMessage,
              reply_to: '',
            },
            config
          );

          if (result.success) {
            const reminder: Reminder = {
              id: generateId('rem'),
              taskId,
              collaboratorId,
              message: emailMessage,
              sentAt: new Date().toISOString(),
            };
            set((s) => ({ reminders: [reminder, ...s.reminders] }));
            get().notify('Relance envoyée avec succès', 'success');
            return true;
          } else {
            get().notify(`Erreur envoi relance: ${result.message}`, 'error');
            return false;
          }
        } catch (err) {
          const errMsg = err instanceof Error ? err.message : 'Erreur inconnue';
          console.error('sendReminder error', errMsg);
          get().notify('Erreur lors de l\'envoi de la relance', 'error');
          return false;
        }
      },

      addCalendar: (c) => {
        set((s) => ({ calendars: [...s.calendars, { ...c, id: generateId('cal') }] }));
        get().notify('Calendrier ajouté', 'success');
      },
      updateCalendar: (c) => {
        set((s) => ({ calendars: s.calendars.map((x) => (x.id === c.id ? c : x)) }));
        get().notify('Calendrier mis à jour', 'success');
      },
      toggleCalendarVisibility: (id) => {
        set((s) => ({ calendars: s.calendars.map((c) => (c.id === id ? { ...c, visible: !c.visible } : c)) }));
      },

      notify: (msg, type = 'info') => {
        const time = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
        const notif: Notification = { id: generateId('n'), msg, type, time };
        set((s) => ({ notifications: [notif, ...s.notifications].slice(0, 20) }));
      },
      clearNotifications: () => set({ notifications: [] }),

      exportData: () => {
        const { tasks, clients, collaborators, notifications } = get();
        const data = { tasks, clients, collaborators, notifications, exported: new Date().toISOString() };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cabinet-export-${dateKey(new Date())}.json`;
        a.click();
        URL.revokeObjectURL(url);
        get().notify('Export effectué', 'success');
      },
      importData: (json) => {
        try {
          const data = JSON.parse(json);
          if (data.tasks) set({ tasks: data.tasks });
          if (data.clients) set({ clients: data.clients });
          if (data.collaborators) set({ collaborators: data.collaborators });
          if (data.notifications) set({ notifications: data.notifications });
          get().notify('Import réussi', 'success');
          return true;
        } catch {
          get().notify('Erreur lors de l\'import', 'error');
          return false;
        }
      },
      resetTasks: () => {
        set({ tasks: [] });
        get().notify('Toutes les tâches supprimées', 'error');
      },
      resetClients: () => {
        set({ clients: DEFAULT_CLIENTS });
        get().notify('Entreprises réinitialisées', 'info');
      },
      resetCollaborators: () => {
        set({ collaborators: DEFAULT_COLLABORATORS });
        get().notify('Collaborateurs réinitialisés', 'info');
      },

      lastSaved: null,
    }),
    {
      name: 'semainier-pro-storage',
      storage: indexedStorage as any,
      partialize: (state) => ({
        darkMode: state.darkMode,
        tasks: state.tasks,
        clients: state.clients,
        collaborators: state.collaborators,
        notifications: state.notifications,
        currentView: state.currentView,
        currentWeekStart: state.currentWeekStart instanceof Date ? state.currentWeekStart.toISOString() : state.currentWeekStart,
        currentMonth: state.currentMonth,
        filterCat: state.filterCat,
        filterStatus: state.filterStatus,
        filterClient: state.filterClient,
        filterCollab: state.filterCollab,
        search: state.search,
        calendars: state.calendars,
        emailJsConfig: state.emailJsConfig,
      }),
      onRehydrateStorage: () => (state) => {
        if (state && typeof state.currentWeekStart === 'string') {
          state.currentWeekStart = new Date(state.currentWeekStart);
        }
      },
    }
  )
);
