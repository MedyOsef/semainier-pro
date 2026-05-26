import emailjs from '@emailjs/browser';

/**
 * Configuration des variables d'environnement
 * Ajoutez celles-ci dans votre fichier .env:
 * VITE_EMAILJS_SERVICE_ID=your_service_id
 * VITE_EMAILJS_TEMPLATE_ID=your_template_id
 * VITE_EMAILJS_PUBLIC_KEY=your_public_key
 */

// Initialiser EmailJS avec votre clé publique
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;

if (PUBLIC_KEY) {
  emailjs.init(PUBLIC_KEY);
}

export interface EmailParams {
  to_email: string;
  to_name?: string;
  subject: string;
  message: string;
  reply_to?: string;
  [key: string]: string | undefined;
}

/**
 * Envoie un email via EmailJS
 * @param params Les paramètres de l'email
 * @returns Promise avec le résultat de l'envoi
 */
export const sendEmail = async (params: EmailParams) => {
  try {
    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
      throw new Error(
        'EmailJS configuration manquante. Veuillez configurer les variables d\'environnement.'
      );
    }

    const response = await emailjs.send(SERVICE_ID, TEMPLATE_ID, params);
    return {
      success: true,
      messageId: response.status === 200,
      message: 'Email envoyé avec succès',
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
    console.error('Erreur lors de l\'envoi de l\'email:', errorMessage);
    return {
      success: false,
      message: errorMessage,
    };
  }
};

/**
 * Envoie un email avec du HTML
 * @param params Les paramètres de l'email (avec support du HTML)
 */
export const sendEmailWithHTML = async (params: EmailParams) => {
  return sendEmail({
    ...params,
  });
};
