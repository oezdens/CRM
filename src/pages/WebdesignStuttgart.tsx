import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Process } from "@/components/Process";
import { Services } from "@/components/Services";
import { Pricing } from "@/components/Pricing";
import { Contact } from "@/components/Contact";
import FloatingActions from "@/components/FloatingActions";
import { Footer } from "@/components/Footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, Zap, Shield, Star } from "lucide-react";
import { useEffect, useState } from "react";

function MountGradients() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 30);
    return () => clearTimeout(t);
  }, []);
  if (!mounted) return null;
  return (
    <>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent opacity-60" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-accent/15 via-transparent to-transparent opacity-50" />
    </>
  );
}

/**
 * Lokale Landing-Page für Stuttgart
 * Basierend auf der Heilbronn-Landingpage, mit lokalem SEO/Text für Stuttgart.
 */
const WebdesignStuttgart = () => {
  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToServices = () => {
    document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen">
      <SEO
        title="Günstiges Webdesign Stuttgart – Professionelle Websites | oezdensweb"
        description="Webdesign in Stuttgart: Moderne, responsive und SEO-optimierte Websites für kleine Unternehmen und Selbstständige in Stuttgart und Umgebung. Faire Preise, persönliche Beratung."
        keywords="webdesign stuttgart, günstige website stuttgart, homepage erstellen stuttgart, webseite stuttgart, webentwicklung stuttgart, seo stuttgart"
        cities={["Stuttgart", "Ludwigsburg", "Esslingen", "Böblingen"]}
      />
      <Navigation />

      {/* Hero-Intro für Stuttgart – modernes, ansprechendes Design */}
      <section className="relative min-h-[100svh] flex items-center justify-center px-4 pt-32 pb-24 overflow-visible">
        {/* Animierter Gradient-Hintergrund */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/10" />
        {/* Radiale Overlays: erst nach Mount rendern, verhindert Flash bevor CSS geladen ist */}
        {typeof window !== "undefined" && (
          <MountGradients />
        )}
        
        {/* Dezente animierte Kreise im Hintergrund - kleiner auf Mobile */}
        <div className="absolute top-10 right-5 md:top-20 md:right-10 w-40 h-40 md:w-72 md:h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 left-5 md:bottom-20 md:left-10 w-48 h-48 md:w-96 md:h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        
        <div className="container mx-auto max-w-5xl relative z-10 px-4">
          <div className="text-center space-y-3 md:space-y-4 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            
            {/* Location Badge removed to avoid initial white flash */}

            {/* Hauptüberschrift */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight leading-[1.25] pb-6 md:pb-8 mb-2 md:mb-3">
              <span className="block text-foreground">Professionelles</span>
              <span className="block pb-2 md:pb-3 bg-gradient-to-r from-primary via-purple-500 to-accent bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                Webdesign in Stuttgart
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground max-w-xs sm:max-w-md md:max-w-xl lg:max-w-2xl mx-auto leading-relaxed">
              Moderne, <strong className="text-foreground">SEO-optimierte Websites</strong> für 
              Unternehmen in Stuttgart und Umgebung – 
              <span className="text-primary font-semibold"> faire Preise, persönliche Beratung</span>.
            </p>

            {/* Feature Pills - responsive sizing */}
            <div className="flex flex-wrap justify-center gap-2 pt-2">
              <div className="flex items-center gap-1.5 md:gap-2 px-2.5 md:px-4 py-1.5 md:py-2 rounded-full bg-muted/50 backdrop-blur-sm border border-border/50 text-xs md:text-sm">
                <Zap className="w-3 h-3 md:w-4 md:h-4 text-yellow-500" />
                <span>Schnelle Ladezeit</span>
              </div>
              <div className="flex items-center gap-1.5 md:gap-2 px-2.5 md:px-4 py-1.5 md:py-2 rounded-full bg-muted/50 backdrop-blur-sm border border-border/50 text-xs md:text-sm">
                <Shield className="w-3 h-3 md:w-4 md:h-4 text-green-500" />
                <span>DSGVO-konform</span>
              </div>
              <div className="flex items-center gap-1.5 md:gap-2 px-2.5 md:px-4 py-1.5 md:py-2 rounded-full bg-muted/50 backdrop-blur-sm border border-border/50 text-xs md:text-sm">
                <Star className="w-3 h-3 md:w-4 md:h-4 text-primary" />
                <span>100% Zufriedenheit</span>
              </div>
            </div>

            {/* CTA Buttons - responsive sizing */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-4">
              <Button
                size="default"
                onClick={scrollToContact}
                className="group w-full sm:w-auto text-sm px-5 py-2.5 rounded-full shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
              >
                Kostenlos anfragen
                <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                variant="outline"
                size="default"
                onClick={scrollToServices}
                className="w-full sm:w-auto text-sm px-5 py-2.5 rounded-full backdrop-blur-sm hover:bg-muted/50 transition-all duration-300"
              >
                Leistungen entdecken
              </Button>
            </div>

            {/* Trust Indicators - responsive */}
            <div className="pt-4 flex flex-col items-center gap-2">
              <p className="text-xs md:text-sm text-muted-foreground">
                Vertrauen von Unternehmen in der Region
              </p>
              <div className="flex items-center gap-0.5 md:gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 md:w-5 md:h-5 fill-yellow-500 text-yellow-500" />
                ))}
                <span className="ml-1.5 md:ml-2 text-xs md:text-sm font-medium">5.0 Bewertung</span>
              </div>
              <div className="flex flex-wrap justify-center gap-1.5 text-[10px] md:text-xs text-muted-foreground">
                <span className="px-1.5 md:px-2 py-0.5 md:py-1 rounded bg-muted/30">Stuttgart</span>
                <span className="px-1.5 md:px-2 py-0.5 md:py-1 rounded bg-muted/30">Ludwigsburg</span>
                <span className="px-1.5 md:px-2 py-0.5 md:py-1 rounded bg-muted/30">Esslingen</span>
                <span className="px-1.5 md:px-2 py-0.5 md:py-1 rounded bg-muted/30">Böblingen</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator - hidden on mobile to save space */}
        <div className="hidden md:flex absolute bottom-6 left-0 right-0 justify-center items-center flex-col gap-2">
          <div className="w-5 h-8 md:w-6 md:h-10 rounded-full border-2 border-foreground/20 flex justify-center items-start pt-1.5 md:pt-2">
            <div className="w-1 h-2 md:w-1.5 md:h-3 rounded-full bg-primary" />
          </div>
          <span className="text-[10px] md:text-xs text-muted-foreground text-center">Mehr entdecken</span>
        </div>
      </section>

      {/* Bestehende Komponenten – identisch zur Hauptseite */}
      <About />
      <Process />
      <Services />
      <Pricing />
      <Contact />
      <FloatingActions />
      <Footer />
    </div>
  );
};

export default WebdesignStuttgart;
