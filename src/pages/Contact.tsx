import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function Contact() {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // In production, this would send to a backend API
    setTimeout(() => {
      toast({
        title: language === 'fr' ? 'Message envoyé' : 'Message Sent',
        description: language === 'fr' ? 'Nous vous répondrons bientôt' : 'We will get back to you soon',
      });
      setFormData({ email: '', subject: '', message: '' });
      setLoading(false);
    }, 1000);
  };

  return (
    <>
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="container mx-auto px-4 pt-24 pb-12 max-w-4xl flex-1">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">
              {language === 'fr' ? 'Contactez-nous' : 'Contact Us'}
            </h1>
            <p className="text-muted-foreground">
              {language === 'fr' 
                ? 'Avez-vous une question ou besoin d\'aide ? Nous sommes là pour vous.'
                : 'Have a question or need support? We\'re here to help.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" />
                  {language === 'fr' ? 'Email' : 'Email'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <a href="mailto:contact@riadprix.com" className="text-muted-foreground hover:text-primary">
                  contact@riadprix.com
                </a>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-primary" />
                  {language === 'fr' ? 'Téléphone' : 'Phone'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <a href="tel:+212600000000" className="text-muted-foreground hover:text-primary">
                  +212 600 000 000
                </a>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  {language === 'fr' ? 'Adresse' : 'Address'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Marrakech, Morocco</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{language === 'fr' ? 'Envoyez-nous un message' : 'Send us a message'}</CardTitle>
              <CardDescription>
                {language === 'fr' ? 'Remplissez le formulaire ci-dessous' : 'Fill in the form below'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">
                    {language === 'fr' ? 'Votre Email' : 'Your Email'}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder={language === 'fr' ? 'votre@email.com' : 'your@email.com'}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="subject">
                    {language === 'fr' ? 'Sujet' : 'Subject'}
                  </Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder={language === 'fr' ? 'Sujet de votre message' : 'Message subject'}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="message">
                    {language === 'fr' ? 'Message' : 'Message'}
                  </Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder={language === 'fr' ? 'Comment pouvons-nous vous aider ?' : 'How can we help you?'}
                    rows={5}
                    required
                  />
                </div>
                <Button type="submit" disabled={loading} className="gap-2">
                  <Send className="h-4 w-4" />
                  {loading 
                    ? (language === 'fr' ? 'Envoi...' : 'Sending...')
                    : (language === 'fr' ? 'Envoyer le message' : 'Send Message')
                  }
                </Button>
              </form>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    </>
  );
}

