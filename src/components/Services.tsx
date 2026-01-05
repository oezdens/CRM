import { Code, Palette, Rocket, Search, Smartphone, Zap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

const services = [
  {
    icon: Code,
    title: "Webentwicklung",
    description: "Moderne, saubere und wartbare Websites mit neuesten Technologien."
  },
  {
    icon: Palette,
    title: "UI/UX Design",
    description: "Intuitive und ansprechende Designs, die Ihre Nutzer begeistern."
  },
  {
    icon: Smartphone,
    title: "Responsive Design",
    description: "Perfekte Darstellung auf allen Geräten - vom Smartphone bis Desktop."
  },
  {
    icon: Rocket,
    title: "Performance",
    description: "Blitzschnelle Ladezeiten für optimale Nutzererfahrung."
  },
  {
    icon: Search,
    title: "SEO Optimierung",
    description: "Bessere Sichtbarkeit in Suchmaschinen durch technisches SEO."
  },
  {
    icon: Zap,
    title: "Wartung & Support",
    description: "Kontinuierliche Betreuung und Updates für Ihre Website."
  }
];

export function Services() {
  return (
    <section id="services" className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">
            <span className="sr-only">Meine Dienstleistungen - Webentwicklung, UI/UX Design, SEO Optimierung</span>
            <span aria-hidden="true" className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">Meine Dienstleistung</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Als Einzelunternehmer realisiere ich moderne, performante Websites und begleite dich
            von der Konzeption bis zur Umsetzung — persönlich und direkt.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <Card
              key={index}
              className="glow-card rounded-2xl p-8 text-left shadow-lg hover:shadow-2xl transition-transform duration-300 hover:-translate-y-1 border border-transparent bg-card/80 hover:ring-2 hover:ring-accent/30"
            >
              <CardHeader className="p-0 mb-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-700/20 to-indigo-700/15 flex items-center justify-center mb-4 border border-purple-600/10">
                  <service.icon className="h-7 w-7 text-primary" />
                </div>
                <CardTitle className="text-xl">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm text-muted-foreground">
                  {service.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-base md:text-lg text-muted-foreground max-w-3xl mx-auto text-center leading-relaxed space-y-4">
          <p>
            Nach Abschluss der Entwicklung erhalten Sie einen ausführlichen Gesamtbericht zu Ihrer neuen Webseite. 
            Dieser umfasst eine detaillierte Performance-Analyse, SEO-Bewertung, Ladezeiten-Optimierung und konkrete 
            Empfehlungen für die Zukunft Ihrer Online-Präsenz.
          </p>
          <p className="text-sm">
            So wissen Sie genau, wie Ihre Webseite technisch aufgestellt ist und welche Stärken sie hat.
          </p>
        </div>
      </div>
    </section>
  );
}
