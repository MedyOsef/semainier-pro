import emailjs from '@emailjs/browser';

export interface EmailJSConfig {
  publicKey: string;
  serviceId: string;
  templateId: string;
}

/**
 * Configuration des variables d'environnement
 * Ajoutez celles-ci dans votre fichier .env si nécessaire:
 * VITE_EMAILJS_SERVICE_ID=your_service_id
 * VITE_EMAILJS_TEMPLATE_ID=your_template_id
 * VITE_EMAILJS_PUBLIC_KEY=your_public_key
 */

const ENV_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const ENV_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const ENV_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;

const initEmailJS = (publicKey: string) => {
  if (publicKey) {
    emailjs.init(publicKey);
  }
};

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
 * @param config Configuration EmailJS optionnelle (préférée)
 * @returns Promise avec le résultat de l'envoi
 */
export const sendEmail = async (params: EmailParams, config?: EmailJSConfig) => {
  try {
    const publicKey = config?.publicKey || ENV_PUBLIC_KEY;
    const serviceId = config?.serviceId || ENV_SERVICE_ID;
    const templateId = config?.templateId || ENV_TEMPLATE_ID;

    if (!serviceId || !templateId || !publicKey) {
      throw new Error(
        'EmailJS configuration manquante. Veuillez configurer votre clé publique, service et template.'
      );
    }

    if (config?.publicKey) {
      initEmailJS(config.publicKey);
    } else {
      initEmailJS(publicKey);
    }

    const response = await emailjs.send(serviceId, templateId, params);
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
