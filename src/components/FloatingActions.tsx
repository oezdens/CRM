import { useEffect, useState } from 'react';
import { Phone, MessageSquare } from 'lucide-react';

export default function FloatingActions() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    // Use a scroll-based center-point detection to avoid flaky IntersectionObserver
    const targetIds = ['about', 'process', 'services', 'pricing'];
    const hideIds = ['home', 'contact'];

    const targets = targetIds.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const hides = hideIds.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];

    if (!targets.length && !hides.length) return;

    const isElementAtCenter = (el: HTMLElement) => {
      const rect = el.getBoundingClientRect();
      const centerY = window.innerHeight / 2;
      return rect.top <= centerY && rect.bottom >= centerY;
    };

    const check = () => {
      const anyTarget = targets.some((el) => isElementAtCenter(el));
      const anyHide = hides.some((el) => isElementAtCenter(el));
      setVisible(anyTarget && !anyHide);
    };

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          check();
          ticking = false;
        });
        ticking = true;
      }
    };

    // initial check
    check();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  // always render but animate in/out with transform & opacity so it slides from the side
  const containerStyle: React.CSSProperties = {
    position: 'fixed',
    right: 12,
    bottom: 22,
    zIndex: 80,
    // slide a small amount off-screen on collapse so on small widths it still moves visibly
    transform: visible ? 'translateX(0)' : 'translateX(56px)',
    opacity: visible ? 1 : 0,
    transition: 'transform 320ms cubic-bezier(.2,.9,.2,1), opacity 240ms ease',
    pointerEvents: visible ? 'auto' : 'none'
  };

  return (
    <div style={containerStyle}>
      <div className="flex flex-col gap-4 items-end">
        <a
          href="https://wa.me/4915758199741"
          target="_blank"
          rel="noreferrer"
          aria-label="WhatsApp"
          className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg hover:scale-105 transform transition"
        >
          <Phone className="w-5 h-5 text-white" />
        </a>

        <button
          onClick={() => {
            const el = document.getElementById('contact');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          aria-label="Nachricht"
          className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center shadow-lg hover:scale-105 transform transition"
        >
          <MessageSquare className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  );
}
