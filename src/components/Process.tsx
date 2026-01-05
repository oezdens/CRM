import { Check, MessageSquare, Palette, Rocket, Zap } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const steps = [
  {
    number: "01",
    icon: MessageSquare,
    title: "Kostenloses Gespräch",
    description: "Erzähle mir von deiner Vision und deinen Zielen für deine Webseite.",
    features: [
      "30 Min. Beratung",
      "Unverbindlich",
      "Individuelle Strategie"
    ]
  },
  {
    number: "02",
    icon: Palette,
    title: "Kostenloser Entwurf",
    description: "Ich erstelle einen maßgeschneiderten Entwurf, der deine Marke perfekt repräsentiert.",
    features: [
      "Design-Konzept",
      "2 Revisionen",
      "Responsive Layout"
    ]
  },
  {
    number: "03",
    icon: Rocket,
    title: "Feinschliff & Go-Live",
    description: "Ich kümmere mich um die Details und bringe deine neue Webseite online.",
    features: [
      "Finalisierung",
      "Testing",
      "Launch Support"
    ]
  }
];

const benefits = [
  "Keine versteckten Kosten",
  "100% Transparent",
  "Persönlicher Support",
  "Gesamtbericht inklusive"
];

export function Process() {
  const scrollToContact = () => {
    const element = document.getElementById("contact");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="process" className="py-20 px-4 bg-muted/20">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16 space-y-6">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent/10 text-accent border border-accent/20">
            <Zap className="h-4 w-4" />
            <span className="text-sm font-medium">Schnell. Professionell. Transparent.</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold leading-tight">
            <span className="sr-only">Von der Idee zur fertigen Webseite - So funktioniert der Prozess</span>
            <span aria-hidden="true">
              von der{" "}
              <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                Idee
              </span>
              {" "}zur{" "}
              <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                Webseite
              </span>
            </span>
          </h2>

          <p className="text-xl text-muted-foreground">
            Deine professionelle Webseite in nur 3 einfachen Schritten — inklusive kostenlosem Beratungsgespräch, 
            individuellem Design-Entwurf und einem ausführlichen Gesamtbericht mit SEO-Analyse und Performance-Bewertung nach Projektabschluss. 
            Dabei begleite ich dich persönlich durch jeden Schritt und sorge dafür, dass deine Webseite nicht nur gut aussieht, sondern auch messbare Ergebnisse liefert.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {steps.map((step, index) => (
            <Card
              key={index}
              className="bg-card/50 backdrop-blur-sm border-border hover:bg-card/80 transition-all duration-300 relative overflow-hidden group hover:ring-2 hover:ring-accent/30"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-accent/20 to-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500"></div>
              
              <CardHeader>
                <div className="flex items-start justify-between mb-4">
                  <div className="px-3 py-1 rounded-full bg-accent/10 text-accent border border-accent/20 text-sm font-semibold">
                    Schritt {step.number}
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <step.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-2xl mb-3">{step.title}</CardTitle>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3">
                  {step.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Check className="h-3 w-3 text-primary" />
                      </div>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <Button
            size="lg"
            onClick={scrollToContact}
            className="bg-gradient-to-r from-accent to-primary hover:opacity-90 text-white font-semibold px-8 text-lg"
          >
            Jetzt kostenlos starten
            <Rocket className="ml-2 h-5 w-5" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={scrollToContact}
            className="font-semibold px-8 text-lg"
          >
            Kontakt aufnehmen
          </Button>
        </div>

        <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-muted-foreground">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <span>{benefit}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
