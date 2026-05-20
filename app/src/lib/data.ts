import type { Client, Collaborator, Task } from '@/types';

export const DEFAULT_CLIENTS: Client[] = [
  { id: 'c1', name: 'Aid Life', type: 'Entreprise', secteur: 'Santé' },
  { id: 'c2', name: 'Infolog', type: 'SARL', secteur: 'Technologie' },
  { id: 'c3', name: 'Ab Lub', type: 'SA', secteur: 'Commerce' },
  { id: 'c4', name: 'MAF', type: 'Entreprise', secteur: 'Finance' },
  { id: 'c5', name: 'Groupe Tasnim', type: 'Groupe', secteur: 'Multi-secteur' },
  { id: 'c6', name: 'Al Qalam', type: 'SARL', secteur: 'Éducation' },
  { id: 'c7', name: 'Fatabe', type: 'SA', secteur: 'BTP' },
  { id: 'c8', name: 'Tasnim Voyage', type: 'SARL', secteur: 'Tourisme' },
];

export const DEFAULT_COLLABORATORS: Collaborator[] = [
  { id: 'col1', name: 'Amosse A.', role: 'Expert-comptable', email: 'amosse@cabinet.ci', color: '#4f6ef7' },
  { id: 'col2', name: 'Diallo Aminata', role: 'Comptable senior', email: 'diallo@cabinet.ci', color: '#5a9b7d' },
  { id: 'col3', name: 'Koné Ibrahim', role: 'Fiscaliste', email: 'kone@cabinet.ci', color: '#d4a24e' },
  { id: 'col4', name: 'Traoré Marie', role: 'Assistante comptable', email: 'traore@cabinet.ci', color: '#8b5cf6' },
];

export const SUGGESTIONS: { title: string; category: Task['category']; priority: Task['priority']; duration: number; desc: string }[] = [
  { title: 'Déclaration TVA', category: 'Fiscal', priority: 'Haute', duration: 3, desc: 'Préparation et dépôt déclaration mensuelle TVA' },
  { title: 'Déclaration ITS', category: 'Fiscal', priority: 'Haute', duration: 2, desc: 'Impôt sur les Traitements et Salaires' },
  { title: 'Déclaration CNPS', category: 'Social', priority: 'Haute', duration: 2, desc: 'Cotisations Caisse Nationale de Prévoyance Sociale' },
  { title: 'Rapprochement bancaire', category: 'Comptabilité', priority: 'Moyenne', duration: 2, desc: 'Rapprochement relevés bancaires et livres comptables' },
  { title: 'Bulletins de paie', category: 'Social', priority: 'Haute', duration: 4, desc: 'Élaboration bulletins de salaire du mois' },
  { title: 'Préparation états financ.', category: 'États financiers', priority: 'Haute', duration: 8, desc: 'Bilan, compte de résultat et annexes' },
  { title: 'Lettrage clients', category: 'Comptabilité', priority: 'Moyenne', duration: 2, desc: 'Lettrage comptes clients et apurement des soldes' },
  { title: 'Archivage comptable', category: 'Administratif', priority: 'Basse', duration: 3, desc: 'Classement et archivage pièces comptables' },
  { title: 'Liasse fiscale', category: 'Fiscal', priority: 'Haute', duration: 12, desc: 'Préparation liasse fiscale annuelle' },
  { title: 'Assemblée générale', category: 'Juridique', priority: 'Haute', duration: 6, desc: 'Documents pour l\'assemblée générale' },
  { title: 'Révision comptable', category: 'Comptabilité', priority: 'Haute', duration: 5, desc: 'Révision complète des comptes' },
  { title: 'Collecte des pièces', category: 'Administratif', priority: 'Haute', duration: 3, desc: 'Collecte et tri des pièces justificatives' },
];

export const JOURNEE_TYPE = [
  { time: '8h00', label: 'Début', icon: 'DoorOpen', tint: 'rgba(214,126,98,0.15)' },
  { time: '9h00', label: 'Ouverture', icon: 'PhoneCall', tint: 'rgba(185,194,168,0.3)' },
  { time: '10h30', label: 'Réunion', icon: 'UsersRound', tint: 'rgba(248,245,238,1)' },
  { time: '12h00', label: 'Repas', icon: 'UtensilsCrossed', tint: 'rgba(185,194,168,0.3)' },
  { time: '13h30', label: 'Dossier', icon: 'FolderOpen', tint: 'rgba(248,245,238,1)' },
  { time: '15h00', label: 'Brainstorming', icon: 'Lightbulb', tint: 'rgba(214,126,98,0.15)' },
  { time: '17h00', label: 'Bilan', icon: 'ClipboardCheck', tint: 'rgba(248,245,238,1)' },
  { time: '18h00', label: 'Fermeture', icon: 'Moon', tint: 'rgba(185,194,168,0.3)' },
];

export function generateId(prefix: string): string {
  return prefix + Date.now() + Math.random().toString(36).slice(2);
}
