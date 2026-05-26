import { useState, useCallback } from 'react';
import { sendEmail, EmailParams } from '../lib/emailService';

interface UseEmailOptions {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

interface UseEmailReturn {
  send: (params: EmailParams) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

/**
 * Hook personnalisé pour envoyer des emails avec EmailJS
 * @param options Options de configuration
 * @returns Fonctions et états pour gérer l'envoi d'emails
 */
export const useEmail = (options?: UseEmailOptions): UseEmailReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const send = useCallback(
    async (params: EmailParams) => {
      setIsLoading(true);
      setError(null);
      setSuccess(false);

      try {
        const result = await sendEmail(params);

        if (result.success) {
          setSuccess(true);
          options?.onSuccess?.();
        } else {
          setError(result.message);
          options?.onError?.(result.message);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
        setError(errorMessage);
        options?.onError?.(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [options]
  );

  return {
    send,
    isLoading,
    error,
    success,
  };
};
