import { Code2, Menu, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "./ui/button";
import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      return;
    }

    // If target element is not on the current page, navigate to home and then try to scroll.
    // Use a small delay to allow the home route to render.
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 120);
    } else {
      // already on home but element might be rendered later (e.g., client-side); retry briefly
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 120);
    }
  };

  const navigate = useNavigate();
  const location = useLocation();

  const navButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [underlineWidth, setUnderlineWidth] = useState<number>(0);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    // Only observe sections when on the home route. On other pages (impressum/datenschutz)
    // we want no navigation item to appear active.
    if (location.pathname !== "/") {
      setActiveSection("");
      return;
    }

    const sections = ["home", "about", "services", "pricing", "process", "contact"];
    const observers: IntersectionObserver[] = [];

    const options = {
      root: null,
      rootMargin: "-40% 0px -40% 0px",
      threshold: 0
    };

    const callback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          if (id) setActiveSection(id);
        }
      });
    };

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        const obs = new IntersectionObserver(callback, options);
        obs.observe(el);
        observers.push(obs);
      }
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [location.pathname]);

  // update underline width when active section or window size changes
  useEffect(() => {
    const updateWidth = () => {
      const el = navButtonRefs.current[activeSection];
      if (el) setUnderlineWidth(el.offsetWidth);
      else setUnderlineWidth(0);
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, [activeSection]);
  // compute wrapper classes here to avoid complex inline template literals in JSX
  const wrapperClass =
    `w-full max-w-6xl px-4 md:px-6 py-2 md:py-3 rounded-full transition-all duration-300 flex items-center justify-between overflow-hidden ` +
    (isScrolled
      ? "bg-background/60 backdrop-blur-xl border border-border/50 shadow-2xl"
      : "bg-gradient-to-r from-white/2 to-black/2 border border-border/20");
 
  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300`}
    >
      <div className="container mx-auto px-4 md:px-6 py-2 flex justify-center">
        <div className={wrapperClass}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <Code2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl">oezdensweb</span>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            {[
              { id: "home", label: "Home" },
              { id: "about", label: "Über mich" },
              { id: "process", label: "Ablauf" },
              { id: "services", label: "Leistungen" },
              { id: "pricing", label: "Preise" },
            ].map((item) => (
              <div key={item.id} className="flex flex-col items-center">
                <button
                  onClick={() => scrollToSection(item.id)}
                  ref={(el) => (navButtonRefs.current[item.id] = el)}
                  className={`text-sm font-medium px-3 py-2 rounded-full transition-colors ${
                    activeSection === item.id
                      ? "text-primary"
                      : "text-foreground/80 hover:text-foreground"
                  }`}
                >
                  {item.label}
                </button>
                <div
                  className={`h-0.5 mt-1 rounded-full transition-all bg-gradient-to-r from-primary to-accent`}
                  style={{
                    width: activeSection === item.id ? (underlineWidth ? `${underlineWidth}px` : undefined) : 0,
                    opacity: activeSection === item.id ? 1 : 0
                  }}
                />
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button
              onClick={() => scrollToSection("contact")}
              className="hidden md:inline-flex bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-6 rounded-full"
            >
              Kontakt
            </Button>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-background/30"
              onClick={() => setMobileOpen((s) => !s)}
              aria-label={mobileOpen ? 'Schließe Navigation' : 'Öffne Navigation'}
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-md border-t border-border/30 w-full z-40">
          <div className="container mx-auto px-6 py-4">
            <div className="flex flex-col gap-3">
              {[
                { id: "home", label: "Home" },
                { id: "about", label: "Über mich" },
                { id: "process", label: "Ablauf" },
                { id: "services", label: "Leistungen" },
                { id: "pricing", label: "Preise" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => { setMobileOpen(false); scrollToSection(item.id); }}
                  className="text-left w-full py-3 px-4 rounded-md text-sm font-medium text-foreground/90 hover:bg-muted"
                >
                  {item.label}
                </button>
              ))}
              <button onClick={() => { setMobileOpen(false); scrollToSection('contact'); }} className="w-full py-3 px-4 rounded-md bg-accent text-white">Kontakt</button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
