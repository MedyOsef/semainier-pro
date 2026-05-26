import { useState } from 'react';
import { useEmail } from '@/hooks/useEmail';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Exemple de composant de formulaire de contact utilisant EmailJS
 * À adapter selon vos besoins
 */
export function ContactFormExample() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const { send, isLoading, error, success } = useEmail({
    onSuccess: () => {
      setEmail('');
      setName('');
      setMessage('');
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !name || !message) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    await send({
      to_email: 'your-email@company.com', // Changez avec votre email
      to_name: 'Admin',
      subject: `Nouveau message de ${name}`,
      message: `Email: ${email}\n\n${message}`,
      reply_to: email,
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Formulaire de Contact</CardTitle>
        <CardDescription>Envoyez-nous un message</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nom</label>
            <Input
              type="text"
              placeholder="Votre nom"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input
              type="email"
              placeholder="Votre email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Message</label>
            <Textarea
              placeholder="Votre message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isLoading}
              rows={5}
            />
          </div>

          {error && (
            <div className="text-sm text-red-500 bg-red-50 p-2 rounded">
              Erreur: {error}
            </div>
          )}

          {success && (
            <div className="text-sm text-green-500 bg-green-50 p-2 rounded">
              Email envoyé avec succès! Nous vous répondrons bientôt.
            </div>
          )}

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? 'Envoi en cours...' : 'Envoyer'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
