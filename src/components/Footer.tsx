import { Code2, Mail, Github, Instagram } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="py-12 px-4 border-t border-border">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center text-white">
                <Code2 className="h-5 w-5" />
              </div>
              <span className="font-bold text-lg">oezdens</span>
            </div>
            <p className="text-muted-foreground">Moderne Webentwicklung &amp; Design, spezialisiert auf reaktive Oberflächen.</p>
          </div>

          <div className="pl-6">
            <h3 className="font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <button
                  onClick={() => document.getElementById("index")?.scrollIntoView({ behavior: "smooth" })}
                  className="hover:text-primary transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })}
                  className="hover:text-primary transition-colors"
                >
                  Leistungen
                </button>
              </li>
              <li>
                <button
                  onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
                  className="hover:text-primary transition-colors"
                >
                  Über mich
                </button>
              </li>
              <li>
                <button
                  onClick={() => document.getElementById("process")?.scrollIntoView({ behavior: "smooth" })}
                  className="hover:text-primary transition-colors"
                >
                  Ablauf
                </button>
              </li>
              <li>
                <button
                  onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}
                  className="hover:text-primary transition-colors"
                >
                  Preise
                </button>
              </li>
              <li>
                <button
                  onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                  className="hover:text-primary transition-colors"
                >
                  Kontakt
                </button>
              </li>
              
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li className="hover:text-primary transition-colors">UI/UX Design</li>
              <li className="hover:text-primary transition-colors">Front-end Development</li>
              <li className="hover:text-primary transition-colors">SEO Optimierung</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Kontakt</h3>
            <div className="flex flex-col items-start gap-4">
              <Button onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })} className="bg-gradient-to-r from-primary to-accent text-white px-6 py-2 rounded-full">Jetzt Kontakt aufnehmen</Button>
              <div className="flex items-center gap-4">
                <a href="https://www.instagram.com/oezdensweb/" target="_blank" rel="noreferrer" aria-label="Instagram" className="hover:text-primary transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="mailto:oezdens.web@outlook.de" aria-label="E-Mail" className="hover:text-primary transition-colors">
                  <Mail className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-border text-muted-foreground">
          {/* SEO: Städte-Liste für Local SEO */}
          <div className="text-center mb-6">
            <p className="text-sm">
              <span className="text-foreground font-medium">Webentwicklung</span>{" "}
              <span className="text-muted-foreground">in:</span>{" "}
              <span className="text-muted-foreground/80">
                Berlin • Hamburg • München • Köln • Frankfurt • Stuttgart • Düsseldorf • Leipzig • Dortmund • Essen • Bremen • Dresden • Hannover • Nürnberg • Heilbronn
              </span>
            </p>
          </div>
          
          <div className="flex items-center justify-between">
            <p className="text-sm">&copy; {new Date().getFullYear()} oezdens. Alle Rechte vorbehalten.</p>
            <div className="text-sm flex flex-col md:flex-row md:items-center md:space-x-4 space-y-2 md:space-y-0">
              <Link
                to="/impressum"
                onClick={() => window.scrollTo({ top: 0, behavior: "auto" })}
                className="hover:text-primary transition-colors"
              >
                Impressum
              </Link>
              <Link
                to="/datenschutz"
                onClick={() => window.scrollTo({ top: 0, behavior: "auto" })}
                className="hover:text-primary transition-colors"
              >
                Datenschutzerklärung
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
