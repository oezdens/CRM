import { Navigation } from "@/components/Navigation";
import { About } from "@/components/About";
import { Process } from "@/components/Process";
import { Services } from "@/components/Services";
import { Pricing } from "@/components/Pricing";
import { Contact } from "@/components/Contact";
import FloatingActions from "@/components/FloatingActions";
import { Footer } from "@/components/Footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Shield, Star } from "lucide-react";
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

const WebdesignFrankfurt = () => {
  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };
  const scrollToServices = () => {
    document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen">
      <SEO
        title="Günstiges Webdesign Frankfurt – Professionelle Websites | oezdensweb"
        description="Webdesign in Frankfurt: Moderne, responsive und SEO-optimierte Websites für kleine Unternehmen und Selbstständige in Frankfurt. Faire Preise, persönliche Beratung."
        keywords="webdesign frankfurt, günstige website frankfurt, homepage erstellen frankfurt, webseite frankfurt, webentwicklung frankfurt, seo frankfurt"
        cities={["Frankfurt am Main", "Wiesbaden", "Mainz", "Offenbach"]}
      />
      <Navigation />
      <section className="relative min-h-[100svh] flex items-center justify-center px-4 pt-32 pb-24 overflow-visible">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/10" />
        {typeof window !== "undefined" && <MountGradients />}
        <div className="container mx-auto max-w-5xl relative z-10 px-4">
          <div className="text-center space-y-3 md:space-y-4 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight leading-[1.25] pb-6 md:pb-8 mb-2 md:mb-3">
              <span className="block text-foreground">Professionelles</span>
              <span className="block pb-2 md:pb-3 bg-gradient-to-r from-primary via-purple-500 to-accent bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">Webdesign in Frankfurt</span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground max-w-xs sm:max-w-md md:max-w-xl lg:max-w-2xl mx-auto leading-relaxed">Moderne, <strong className="text-foreground">SEO-optimierte Websites</strong> für Unternehmen in Frankfurt – <span className="text-primary font-semibold">faire Preise, persönliche Beratung</span>.</p>
            <div className="flex flex-wrap justify-center gap-2 pt-2">
              <div className="flex items-center gap-1.5 md:gap-2 px-2.5 md:px-4 py-1.5 md:py-2 rounded-full bg-muted/50 backdrop-blur-sm border border-border/50 text-xs md:text-sm"><Zap className="w-3 h-3 md:w-4 md:h-4 text-yellow-500" /><span>Schnelle Ladezeit</span></div>
              <div className="flex items-center gap-1.5 md:gap-2 px-2.5 md:px-4 py-1.5 md:py-2 rounded-full bg-muted/50 backdrop-blur-sm border border-border/50 text-xs md:text-sm"><Shield className="w-3 h-3 md:w-4 md:h-4 text-green-500" /><span>DSGVO-konform</span></div>
              <div className="flex items-center gap-1.5 md:gap-2 px-2.5 md:px-4 py-1.5 md:py-2 rounded-full bg-muted/50 backdrop-blur-sm border border-border/50 text-xs md:text-sm"><Star className="w-3 h-3 md:w-4 md:h-4 text-primary" /><span>100% Zufriedenheit</span></div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-4">
              <Button size="default" onClick={scrollToContact} className="group w-full sm:w-auto text-sm px-5 py-2.5 rounded-full shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300">Kostenlos anfragen<ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5 group-hover:translate-x-1 transition-transform" /></Button>
              <Button variant="outline" size="default" onClick={scrollToServices} className="w-full sm:w-auto text-sm px-5 py-2.5 rounded-full backdrop-blur-sm hover:bg-muted/50 transition-all duration-300">Leistungen entdecken</Button>
            </div>
          </div>
        </div>
      </section>
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

export default WebdesignFrankfurt;
