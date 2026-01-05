import { Award, Code2, Rocket, TrendingUp, Users } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import developerImage from "@/Bilder/ich.jpg";

const stats = [
  {
    icon: Rocket,
    value: "30+",
    label: "Projekte"
  },
  {
    icon: Award,
    value: "9+",
    label: "Jahre"
  },
  {
    icon: TrendingUp,
    value: "100%",
    label: "Zufriedenheit"
  },
  {
    icon: Users,
    value: "24/7",
    label: "Support"
  }
];

export function About() {
  const scrollToContact = () => {
    const element = document.getElementById("contact");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToServices = () => {
    const element = document.getElementById("services");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="about" className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20">
              <Code2 className="h-4 w-4" />
              <span className="text-sm font-medium">IT Webentwickler</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              <span className="sr-only">Über mich - Ihr professioneller Webentwickler für günstige Websites</span>
              <span aria-hidden="true">
                Hallo, ich bin{" "}
                <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                  dein Entwickler
                </span>
              </span>
            </h2>

            <div className="space-y-4 text-muted-foreground text-base">
              <p>
                Als fundierter Informatiker vereine ich tiefgehendes technisches Know-how 
                mit der Gestaltungskraft eines leidenschaftlichen Webentwicklers.
              </p>
              <p>
                Ich bin spezialisiert auf React, TypeScript und moderne Web-Technologien 
                und setze Ihre digitalen Visionen in maßgeschneiderte, hervorragend 
                funktionierende Webseiten um.
              </p>
              <p>
                Dank meiner effizienten Solo-Struktur können diese Projekte wesentlich 
                budgetschonender realisiert werden als bei einer klassischen Agentur – 
                ohne Abstriche bei Qualität und Innovation.
              </p>
              <p>
                Ob Unternehmenswebsite, Portfolio oder Onlineshop – jedes Projekt wird 
                individuell geplant und mit besonderem Fokus auf Benutzerfreundlichkeit, 
                Ladegeschwindigkeit und Suchmaschinenoptimierung umgesetzt. So erreichen 
                Sie nicht nur Ihre Zielgruppe, sondern überzeugen sie auch nachhaltig.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <Button
                size="lg"
                onClick={scrollToContact}
                className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8"
              >
                Projekt starten
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={scrollToServices}
                className="font-semibold px-8"
              >
                Meine Leistungen
              </Button>
            </div>
          </div>

          <div className="relative translate-y-6 lg:translate-y-8">
            <div className="rounded-3xl p-1 bg-gradient-to-br from-purple-800/60 via-transparent to-pink-600/40 shadow-2xl">
              <div className="rounded-2xl overflow-hidden bg-card/90 border-2 border-border/20 group ring-0 transition-shadow duration-300 group-hover:ring-2 group-hover:ring-primary/30">
                <img
                  src={developerImage}
                  alt="Professioneller Webentwickler am Arbeitsplatz"
                  className="w-full h-[320px] md:h-[480px] object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 pointer-events-none rounded-2xl transition-shadow duration-300 group-hover:shadow-[0_0_30px_rgba(124,58,237,0.35)]"></div>
                <div className="absolute bottom-6 left-6">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/90 backdrop-blur-sm text-white">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">Verfügbar für Projekte</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className={
                `rounded-2xl p-6 bg-card/60 backdrop-blur-sm border border-border/20 hover:shadow-2xl transition-all duration-300 hover:ring-2 hover:ring-primary/30`
              }
            >
              <CardContent className="p-0">
                <div className="flex flex-col gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-700/20 to-indigo-700/15 flex items-center justify-center border border-purple-600/10">
                      <stat.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="text-3xl md:text-4xl font-semibold">{stat.value}</div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
