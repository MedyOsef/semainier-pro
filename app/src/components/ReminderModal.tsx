import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { generateReminderMessage } from '@/lib/reminderMessages';
import type { Task, Collaborator } from '@/types';

interface Props {
  task: Task;
  collaborator: Collaborator;
  onClose: () => void;
}

export function ReminderModal({ task, collaborator, onClose }: Props) {
  const { sendReminder, clients } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const [customNote, setCustomNote] = useState<string>('');

  // Récupérer le client associé à la tâche
  const client = task.client ? clients.find((c) => c.id === task.client) : null;
  
  // Générer le message de base selon le statut
  const generatedMessage = generateReminderMessage(task, collaborator, client);

  const handleSend = async () => {
    setIsLoading(true);
    const success = await sendReminder(task.id, collaborator.id, customNote);
    setIsLoading(false);

    if (success) {
      onClose();
    } else {
      alert('Erreur lors de l\'envoi de la relance. Vérifiez la configuration EmailJS.');
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Informations contextuelles */}
      <div className="p-3 rounded-lg" style={{ background: 'var(--cream)', border: '1px solid var(--bor)' }}>
        <div className="mb-3">
          <div className="text-[11px] font-semibold uppercase text-[var(--txt2)] mb-1">Destinataire</div>
          <div className="text-sm text-[var(--txt)]">
            {collaborator.name}
          </div>
          <div className="text-xs text-[var(--txt2)]">{collaborator.email}</div>
        </div>
        <div>
          <div className="text-[11px] font-semibold uppercase text-[var(--txt2)] mb-1">Tâche concernée</div>
          <div className="text-sm text-[var(--txt)]">{task.title}</div>
          <div className="text-xs text-[var(--txt2)]">Statut: {task.status}</div>
        </div>
      </div>

      {/* Aperçu du message généré */}
      <div>
        <label className="text-[11px] font-semibold uppercase text-[var(--txt2)] mb-1.5 block">Message généré (basé sur le statut)</label>
        <div 
          className="p-3 rounded-lg border text-xs whitespace-pre-wrap max-h-[200px] overflow-y-auto"
          style={{ background: 'var(--cream)', borderColor: 'var(--bor)', color: 'var(--txt)' }}
        >
          {generatedMessage}
        </div>
      </div>

      {/* Note personnalisée */}
      <div>
        <label className="text-[11px] font-semibold uppercase text-[var(--txt2)] mb-1.5 block">
          Note personnalisée (optionnel)
        </label>
        <textarea
          value={customNote}
          onChange={(e) => setCustomNote(e.target.value)}
          placeholder="Ajouter une note personnalisée qui sera ajoutée au message..."
          className="input-field min-h-[100px] resize-none"
        />
        <div className="text-xs text-[var(--txt2)] mt-1">
          Cette note sera ajoutée à la fin du message généré.
        </div>
      </div>

      {/* Boutons d'action */}
      <div className="flex gap-3 justify-end pt-2">
        <button
          onClick={onClose}
          disabled={isLoading}
          className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          style={{
            background: 'var(--cream)',
            color: 'var(--txt)',
            border: '1px solid var(--bor)',
          }}
        >
          Annuler
        </button>
        <button
          onClick={handleSend}
          disabled={isLoading}
          className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: '#4f6ef7',
          }}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Envoi...
            </span>
          ) : (
            'Envoyer la relance'
          )}
        </button>
      </div>
    </div>
  );
}
