# Guide d'utilisation d'EmailJS

## Installation ✅
Le package `@emailjs/browser` a été installé avec succès.

## Configuration

### 1. Créer un compte EmailJS
- Allez sur [https://www.emailjs.com/](https://www.emailjs.com/)
- Inscrivez-vous gratuitement
- Confirmez votre email

### 2. Configurer un service
- Dans le dashboard, allez dans "Email Services"
- Cliquez sur "Add Service"
- Choisissez votre fournisseur de email (Gmail, Outlook, etc.)
- Suivez les instructions pour connecter votre email

### 3. Créer un template
- Allez dans "Email Templates"
- Cliquez sur "Create New Template"
- Nommez-le (ex: "contact-form")
- Personnalisez le contenu avec des variables:
  ```
  Bonjour {{to_name}},
  
  {{message}}
  
  Cordialement
  ```
- Notez l'ID du template (ex: template_abc123)

### 4. Configurer les variables d'environnement
1. Créez un fichier `.env` à la racine du projet `app/`:
```bash
VITE_EMAILJS_PUBLIC_KEY=your_public_key
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
```

2. Trouvez vos clés:
   - **Public Key**: Dashboard > Account > API Keys > Public Key
   - **Service ID**: Dashboard > Email Services > (votre service) > Service ID
   - **Template ID**: Dashboard > Email Templates > (votre template) > Template ID

## Utilisation

### Avec le hook `useEmail`

```tsx
import { useEmail } from '@/hooks/useEmail';

function ContactForm() {
  const { send, isLoading, error, success } = useEmail({
    onSuccess: () => console.log('Email envoyé!'),
    onError: (err) => console.error('Erreur:', err),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await send({
      to_email: 'user@example.com',
      to_name: 'John Doe',
      subject: 'Mon sujet',
      message: 'Mon message',
      reply_to: 'sender@example.com',
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <button disabled={isLoading}>
        {isLoading ? 'Envoi...' : 'Envoyer'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>Email envoyé avec succès!</p>}
    </form>
  );
}
```

### Avec la fonction `sendEmail` directement

```tsx
import { sendEmail } from '@/lib/emailService';

const result = await sendEmail({
  to_email: 'recipient@example.com',
  to_name: 'John',
  subject: 'Hello',
  message: 'This is a test email',
});

if (result.success) {
  console.log('Email sent successfully!');
} else {
  console.error('Error:', result.message);
}
```

## Variables disponibles dans les templates

Vous pouvez utiliser les variables suivantes dans vos templates EmailJS:

- `{{to_email}}` - Email du destinataire
- `{{to_name}}` - Nom du destinataire
- `{{subject}}` - Sujet de l'email
- `{{message}}` - Contenu du message
- `{{reply_to}}` - Email de réponse

## Exemples de cas d'usage

### Envoi d'email de contact
```tsx
await send({
  to_email: 'admin@company.com',
  subject: 'Nouveau message de contact',
  message: 'L\'utilisateur a envoyé un nouveau message',
  reply_to: userEmail,
});
```

### Envoi de confirmation
```tsx
await send({
  to_email: userEmail,
  to_name: userName,
  subject: 'Confirmez votre inscription',
  message: 'Cliquez sur le lien ci-dessous pour confirmer',
});
```

### Envoi de rappel
```tsx
await send({
  to_email: taskOwnerEmail,
  subject: 'Rappel: Tâche à effectuer',
  message: `Vous avez une tâche à faire: ${taskTitle}`,
});
```

## Dépannage

### "Configuration manquante"
- Vérifiez que votre fichier `.env` existe
- Assurez-vous que les clés sont correctement copiées
- Redémarrez le serveur dev (npm run dev)

### "Unauthorized"
- Vérifiez que votre Public Key est correcte
- Assurez-vous que le Service ID existe

### L'email n'est pas envoyé
- Vérifiez que le Template ID est correct
- Assurez-vous que les noms des variables correspondent à votre template

## Limites gratuites d'EmailJS
- Jusqu'à 200 emails par jour
- Suffit pour la plupart des applications de petite taille
- Plan payant disponible pour plus d'emails
