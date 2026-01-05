import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import "./Hero.css";

export function Hero() {
  const scrollToContact = () => {
    const element = document.getElementById("contact");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center px-4 pt-8 relative">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-1000 px-2">
          <h1 className="text-5xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.25] pb-6 md:pb-8 mb-2 md:mb-3">
            {/* SEO: Vollständiger Text für Crawler, visuell versteckt */}
            <span className="sr-only">Von der Vision zur Website - Professionelle und günstige Webseiten von oezdensweb</span>
            {/* Sichtbare Animation */}
            <span aria-hidden="true">
              <TypingHeadline />
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed hero-subtext">
            Hochwertiges Webdesign und strategische Umsetzung für Ihren nachhaltigen
            Unternehmenserfolg
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button
              size="default"
              onClick={() => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })}
              className="group"
            >
              Meine Leistungen
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>

        {/* Mehr entdecken am unteren Rand des Hero */}
        <div className="absolute left-0 right-0 bottom-8 flex flex-col items-center">
          <div className="flex flex-col items-center gap-2 text-center">
                <div className="w-8 h-14 rounded-full border border-foreground/20 relative overflow-hidden">
                  <span className="more-dot"></span>
                </div>
            <button
              onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
              className="text-sm text-foreground/80 hover:text-foreground"
            >
              Mehr entdecken
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function TypingHeadline() {
  const full = 'Von der Vision zur Website';
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (index >= full.length) {
      setDone(true);
      return;
    }
    const timeout = setTimeout(() => setIndex((i) => i + 1), 80);
    return () => clearTimeout(timeout);
  }, [index]);

  const displayed = full.slice(0, index);

  // render with gradient spans for the words when fully typed
  const renderWithHighlights = () => {
    const parts: (string | JSX.Element)[] = [];
    const vision = 'Vision';
    const website = 'Website';

    const vPos = displayed.indexOf(vision);
    const wPos = displayed.indexOf(website);

    if (vPos === -1 && wPos === -1) return displayed;

    // order positions
    let cursor = 0;
    const addText = (text: string) => {
      if (text) parts.push(text);
    };

    const firstPos = vPos !== -1 ? vPos : wPos;
    const firstWord = vPos !== -1 ? vision : website;
    const firstLen = firstWord.length;

    // before first
    addText(displayed.slice(0, firstPos));
    // first word (only if fully present)
    if (displayed.length >= firstPos + firstLen) {
      parts.push(
        <span key="first" className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          {firstWord}
        </span>
      );
      cursor = firstPos + firstLen;
    } else {
      addText(displayed.slice(firstPos, displayed.length));
      cursor = displayed.length;
    }

    // remaining
    if (cursor < displayed.length) {
      const rest = displayed.slice(cursor);
      // if rest contains the other word fully, highlight it
      if (rest.includes(vision) && rest.indexOf(vision) + cursor + vision.length <= displayed.length) {
        const rPos = rest.indexOf(vision);
        addText(rest.slice(0, rPos));
        parts.push(
          <span key="vision2" className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {vision}
          </span>
        );
        addText(rest.slice(rPos + vision.length));
      } else if (rest.includes(website) && rest.indexOf(website) + cursor + website.length <= displayed.length) {
        const rPos = rest.indexOf(website);
        addText(rest.slice(0, rPos));
        parts.push(
          <span key="website2" className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {website}
          </span>
        );
        addText(rest.slice(rPos + website.length));
      } else {
        addText(rest);
      }
    }

    return parts;
  };

  return (
    <>
      <span className="typing-text">{renderWithHighlights()}</span>
      <span className={`typing-cursor ${done ? 'typing-cursor--idle' : ''}`}>│</span>
    </>
  );
}
