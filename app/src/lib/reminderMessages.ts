import type { Task, Collaborator, Client } from '@/types';

/**
 * Génère un message de relance formaté selon le statut de la tâche
 * @param task La tâche
 * @param collaborator Le collaborateur destinataire
 * @param client Le client (optionnel)
 * @returns Le message formaté
 */
export const generateReminderMessage = (
  task: Task,
  collaborator: Collaborator,
  client?: Client | null
): string => {
  const projectName = client?.name || 'le projet';
  const deadline = task.deadline ? new Date(task.deadline).toLocaleDateString('fr-FR') : 'Non défini';
  const priority = task.priority || 'Normal';

  switch (task.status) {
    case 'À faire':
      return `Bonjour ${collaborator.name},

Une nouvelle tâche vient de vous être assignée dans le cadre du projet ${projectName}.

Détails de la tâche :
- Intitulé : ${task.title}
- Catégorie : ${task.category}
- Priorité : ${priority}
- Date limite : ${deadline}

Description :
${task.description || '(Pas de description)'}

Nous comptons sur vous pour débuter cette tâche dès que possible.

Cordialement`;

    case 'En cours':
      return `Bonjour ${collaborator.name},

Ceci est un message de suivi concernant la tâche qui vous a été confiée pour le projet ${projectName}.

Pour rappel, l'échéance est fixée au ${deadline}.

Détails de la tâche :
- Intitulé : ${task.title}
- Catégorie : ${task.category}
- Priorité : ${priority}
- Statut actuel : En cours

Rappel de la mission :
${task.description || '(Pas de description)'}

Si vous rencontrez des difficultés ou si vous avez besoin d'éléments complémentaires, n'hésitez pas à revenir vers moi au plus vite.

Merci pour votre rigueur,`;

    case 'Terminé':
      return `Bonjour ${collaborator.name},

Nous avons remarqué que la tâche suivante a été marquée comme terminée :

Détails de la tâche :
- Intitulé : ${task.title}
- Catégorie : ${task.category}
- Projet : ${projectName}

Description :
${task.description || '(Pas de description)'}

Veuillez confirmer que cette tâche a bien été finalisée et que tous les livrables sont prêts.

Merci pour votre implication,`;

    default:
      return `Bonjour ${collaborator.name},

Ceci est un message concernant la tâche "${task.title}" du projet ${projectName}.

Détails :
- Catégorie : ${task.category}
- Priorité : ${priority}
- Date limite : ${deadline}

${task.description || ''}

Cordialement,`;
  }
};
