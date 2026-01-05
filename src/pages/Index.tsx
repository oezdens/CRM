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

const Index = () => {
  return (
    <div className="min-h-screen">
      <SEO
        title={"oezdensweb — Professionelle & günstige Websites"}
        description={"oezdensweb: Moderne, responsive und SEO‑optimierte Webseiten für kleine Unternehmen in Heilbronn, Stuttgart, München und 30+ Städten."}
        keywords={"günstige Webseite, günstige webseite heilbronn, günstige webseite stuttgart, webdesign günstig, günstige homepage"}
        cities={["Heilbronn","Stuttgart","München","Berlin","Hamburg","Köln","Frankfurt am Main","Düsseldorf","Dortmund","Essen","Leipzig","Nürnberg","Hannover","Bremen","Karlsruhe","Mannheim","Freiburg","Augsburg","Wiesbaden","Mainz","Bonn","Münster","Rostock","Kiel","Lübeck","Potsdam","Ulm","Regensburg","Saarbrücken","Bielefeld","Chemnitz","Halle","Erfurt","Magdeburg","Oldenburg"]}
      />
      <Navigation />
      <Hero />
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

export default Index;
