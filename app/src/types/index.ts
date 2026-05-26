export interface Task {
  id: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  category: Category;
  priority: Priority;
  status: Status;
  duration: number;
  client: string; // client id or ''
  deadline: string; // YYYY-MM-DD or ''
  recurrence: 'aucune' | 'hebdo' | 'mensuel';
  color: string;
  startTime: string; // HH:MM or ''
  assignedTo: string[]; // collaborator ids
}

export interface Client {
  id: string;
  name: string;
  type: string;
  secteur: string;
}

export interface Collaborator {
  id: string;
  name: string;
  role: string;
  email: string;
  color: string;
}

export interface Notification {
  id: string;
  msg: string;
  type: 'info' | 'success' | 'error';
  time: string;
}

export interface Calendar {
  id: string;
  name: string;
  color: string;
  visible: boolean;
}

export type Category = 'Fiscal' | 'Social' | 'Comptabilité' | 'Juridique' | 'Reporting' | 'États financiers' | 'Administratif' | 'Personnel';
export type Priority = 'Haute' | 'Moyenne' | 'Basse';
export type Status = 'À faire' | 'En cours' | 'Terminé';
export type ViewName = 'semainier' | 'mois' | 'liste' | 'stats' | 'equipe' | 'kpi' | 'admin';
export type ModalType = 'task' | 'client' | 'collaborateur' | 'suggestions' | 'notifs' | 'confirmation' | 'reminder' | null;

export interface Reminder {
  id: string;
  taskId: string;
  collaboratorId: string;
  message: string;
  sentAt: string;
}

export const CATEGORIES: Category[] = ['Fiscal', 'Social', 'Comptabilité', 'Juridique', 'Reporting', 'États financiers', 'Administratif', 'Personnel'];
export const PRIORITIES: Priority[] = ['Haute', 'Moyenne', 'Basse'];
export const STATUSES: Status[] = ['À faire', 'En cours', 'Terminé'];

export const CAT_COLORS: Record<Category, string> = {
  'Fiscal': '#d67e62',
  'Social': '#5a9b7d',
  'Comptabilité': '#4f6ef7',
  'Juridique': '#8b5cf6',
  'Reporting': '#c45a8e',
  'États financiers': '#2a9d8f',
  'Administratif': '#7a7d8c',
  'Personnel': '#d4a24e',
};

export const PRIO_COLORS: Record<Priority, string> = {
  'Haute': '#c45a4a',
  'Moyenne': '#d4a24e',
  'Basse': '#5a9b7d',
};

export const STATUS_COLORS: Record<Status, string> = {
  'À faire': '#7a7d8c',
  'En cours': '#d4a24e',
  'Terminé': '#5a9b7d',
};

export const JOUR_NOMS = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
export const MOIS_NOMS = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
export const MOIS_COURT = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
