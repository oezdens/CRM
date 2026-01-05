// Simple scroll reveal initializer. Call once at app startup.
export function initScrollReveal(options?: { rootMargin?: string; threshold?: number }) {
  if (typeof window === "undefined" || !('IntersectionObserver' in window)) return;

  // mark that reveal has been initialized so CSS applies hiding rules
  try {
    document.body.classList.add('reveal-enabled');
  } catch (e) {
    // ignore
  }

  const rootMargin = options?.rootMargin ?? '0px 0px -10% 0px';
  const threshold = options?.threshold ?? 0.15;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      const el = entry.target as HTMLElement;
      if (!entry.isIntersecting) return;

      // reveal this element
      el.classList.add('reveal--visible');

      // stagger children with class reveal-child
      const children = Array.from(el.querySelectorAll<HTMLElement>('.reveal-child'));
      children.forEach((child, i) => {
        const delay = i * 90; // ms
        child.style.transitionDelay = `${delay}ms`;
      });

      // Once visible, stop observing this element
      obs.unobserve(el);
    });
  }, { root: null, rootMargin, threshold });

  // Find all reveal roots
  const nodes = Array.from(document.querySelectorAll<HTMLElement>('.reveal'));
  nodes.forEach((n) => {
    // clear any inline delays
    n.classList.remove('reveal--visible');
    const children = Array.from(n.querySelectorAll<HTMLElement>('.reveal-child'));
    children.forEach((c) => c.style.transitionDelay = '0ms');
    observer.observe(n);
  });

  // Immediately reveal nodes already in viewport (guard against timing issues)
  try {
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    nodes.forEach((n) => {
      const rect = n.getBoundingClientRect();
      // if top is within 90% of viewport, reveal immediately
      if (rect.top < viewportHeight * 0.9) {
        n.classList.add('reveal--visible');
        const children = Array.from(n.querySelectorAll<HTMLElement>('.reveal-child'));
        children.forEach((child, i) => {
          const delay = i * 90;
          child.style.transitionDelay = `${delay}ms`;
        });
        observer.unobserve(n);
      }
    });
  } catch (e) {
    // ignore
  }

  // Failsafe: after a short delay, reveal any still-hidden nodes to prevent permanent blank screen
  const fallbackTimer = window.setTimeout(() => {
    nodes.forEach((n) => {
      if (!n.classList.contains('reveal--visible')) {
        n.classList.add('reveal--visible');
      }
    });
  }, 1100);

  // return cleanup
  return () => {
    observer.disconnect();
    window.clearTimeout(fallbackTimer);
    try {
      document.body.classList.remove('reveal-enabled');
    } catch (e) {
      // ignore
    }
  };
}

export default initScrollReveal;
