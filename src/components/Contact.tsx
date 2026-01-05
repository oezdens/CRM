import { useState } from "react";
import { Mail, MessageSquare, User, MapPin, Phone, Send } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

export function Contact() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast({
        title: "Fehler",
        description: "Bitte füllen Sie alle Felder aus.",
        variant: "destructive",
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Fehler",
        description: "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/send-email.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formData.name, email: formData.email, subject: formData.subject, message: formData.message }),
      });

      const data = await res.json().catch(() => ({ success: false, message: 'Unerwartete Antwort vom Server' }));

      if (res.ok && data && data.success) {
        toast({ title: 'Nachricht gesendet!', description: 'Wir melden uns so schnell wie möglich bei Ihnen.' });
        setShowSuccess(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        const msg = (data && data.message) ? data.message : 'Fehler beim Senden der Nachricht.';
        setErrorMessage(msg);
        toast({ title: 'Fehler', description: msg, variant: 'destructive' });
      }
    } catch (err) {
      setErrorMessage('Netzwerkfehler: Bitte prüfen Sie Ihre Verbindung oder kontaktieren Sie uns direkt.');
      toast({ title: 'Fehler', description: 'Netzwerkfehler beim Senden.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold">
            <span className="sr-only">Kontakt aufnehmen - Jetzt unverbindliches Angebot anfordern</span>
            <span aria-hidden="true" className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">Kontakt</span>{' '}
            <span className="text-muted-foreground">aufnehmen</span>
          </h2>
          <p className="mt-4 text-muted-foreground">Haben Sie ein Projekt im Kopf? Lassen Sie uns darüber sprechen!</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-start justify-center">
          {/* Left column - contact cards */}
          <div className="space-y-6 w-full">
            <Card className="rounded-2xl p-6 bg-card/80 border border-primary/20 min-h-[120px]">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">E‑Mail</div>
                  <div className="mt-2 font-medium">oezdens.web@outlook.de</div>
                </div>
              </div>
            </Card>

            <Card className="rounded-2xl p-6 bg-card/80 border border-primary/20 min-h-[120px]">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Standort</div>
                  <div className="mt-2 font-medium">Heilbronn, Deutschland</div>
                </div>
              </div>
            </Card>

            <Card className="rounded-2xl p-6 bg-card/80 border border-primary/20 min-h-[120px]">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Telefon</div>
                  <div className="mt-2 font-medium">
                    <a href="tel:+4915758199741" className="hover:underline">+49 157 58199741</a>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right column - form */}
          <div className="md:col-span-2 w-full">
            <Card className="rounded-2xl p-4 md:p-6 bg-card/80 border border-primary/20 mx-auto w-full">
                <CardHeader>
                  <CardTitle className="text-lg">Nachricht senden</CardTitle>
                </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="flex items-center gap-2 text-sm text-muted-foreground">
                        Name
                      </Label>
                      <Input
                        id="name"
                        placeholder="Ihr Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="bg-transparent"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email" className="flex items-center gap-2 text-sm text-muted-foreground">
                        E‑Mail
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="ihre@email.de"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="bg-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="subject" className="flex items-center gap-2 text-sm text-muted-foreground">Betreff</Label>
                    <Input id="subject" placeholder="Worum geht es?" className="bg-transparent" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} />
                  </div>

                  <div>
                    <Label htmlFor="message" className="flex items-center gap-2 text-sm text-muted-foreground">Nachricht</Label>
                    <Textarea
                      id="message"
                      placeholder="Kurz zum Projekt"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="min-h-[110px] bg-transparent resize-none"
                    />
                  </div>

                  <div>
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-gradient-to-r from-primary to-accent text-white shadow-lg"
                      disabled={isSubmitting}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      {isSubmitting ? "Wird gesendet..." : "Nachricht senden"}
                    </Button>
                  </div>
                </form>
                {/* Success / Error messages */}
                {showSuccess && (
                  <div className="mt-6">
                    <Card className="rounded-2xl p-6 bg-green-50 border border-green-200">
                      <div>
                        <h3 className="text-lg font-semibold text-green-800">E‑Mail wurde verschickt</h3>
                        <p className="mt-2 text-green-700">Vielen Dank — wir melden uns so schnell wie möglich bei Ihnen.</p>
                        <div className="mt-4">
                          <Button variant={"outline" as any} onClick={() => setShowSuccess(false)}>Neue Nachricht senden</Button>
                        </div>
                      </div>
                    </Card>
                  </div>
                )}

                {errorMessage && (
                  <div className="mt-6">
                    <Card className="rounded-2xl p-6 bg-red-50 border border-red-200">
                      <div>
                        <h3 className="text-lg font-semibold text-red-800">Fehler beim Versenden</h3>
                        <p className="mt-2 text-red-700">{errorMessage}</p>
                        <p className="mt-2 text-sm text-muted-foreground">Falls das Problem weiterhin besteht, kontaktieren Sie uns bitte direkt:</p>
                        <div className="mt-4 flex gap-3">
                          <a href="https://wa.me/4915758199741" target="_blank" rel="noreferrer" className="inline-flex items-center px-4 py-2 rounded-md bg-green-600 text-white">WhatsApp</a>
                          <a href="mailto:oezdens.web@outlook.de" className="inline-flex items-center px-4 py-2 rounded-md bg-slate-700 text-white">E‑Mail</a>
                        </div>
                      </div>
                    </Card>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
