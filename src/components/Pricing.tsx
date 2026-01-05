import { Check } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";

const plans = [
  {
    name: "Starter",
    price: "299",
    period: "project",
    description: "Perfekt für kleine Projekte und Landing Pages",
    features: [
      "Bis zu 5 Seiten",
      "Responsive Design",
      "Kontaktformular",
      "SEO Grundlagen",
      "30 Tage Support"
    ],
    popular: false
  },
  {
    name: "Monatspaket",
    price: "40",
    period: "month",
    description: "Monatliche Miete der Webseite — alles inklusive",
    features: [
      "Domain inklusive",
      "Webserver inklusive",
      "Webseitenentwicklung inklusive (einmalig 0€)",
      "Datenbankwartung inklusive",
      "Support 24/7"
    ],
    popular: true
  },
  {
    name: "Professional",
    price: "799",
    period: "project",
    description: "Ideal für Unternehmen und umfangreichere Websites",
    features: [
      "Bis zu 15 Seiten",
      "Premium Design",
      "CMS Integration",
      "Erweiterte SEO",
      "Blog-Funktion",
      "90 Tage Support",
      "Performance Optimierung"
    ],
    popular: false
  }
];

export function Pricing() {
  const scrollToContact = () => {
    const element = document.getElementById("contact");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="pricing" className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">
            <span className="sr-only">Transparente Preise - Günstige Webseiten ab 299 Euro</span>
            <span aria-hidden="true" className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">Transparente Preise</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Ich lege die Karten auf den Tisch. Fair und ohne Haken.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`flex flex-col h-full shadow-card hover:shadow-card-hover transition-all duration-300 relative ${
                plan.popular ? "border-2 border-primary scale-105" : "border border-primary/20"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                    Beliebt
                  </span>
                </div>
              )}
              
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                <CardDescription className="text-base">{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">
                    {plan.price === "Individuell" ? plan.price : `€${plan.price}`}
                  </span>
                  {plan.price !== "Individuell" && (
                    <span className="text-muted-foreground"> / {plan.period === 'month' ? 'Monat' : 'Projekt'}</span>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="flex-grow">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span
                        className={`text-sm ${
                          typeof feature === 'string' && feature.toLowerCase().includes('webseitenentwicklung')
                            ? 'font-semibold text-primary'
                            : ''
                        }`}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              
              <CardFooter>
                <Button
                  onClick={scrollToContact}
                  className={`w-full ${
                    plan.popular
                      ? "bg-primary hover:bg-primary/90"
                      : ""
                  }`}
                  variant={plan.popular ? "default" : "outline"}
                >
                  Jetzt anfragen
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
