import { useEffect } from "react";

type SEOProps = {
  title: string;
  description: string;
  keywords?: string;
  cities?: string[];
};

export default function SEO({ title, description, keywords, cities = [] }: SEOProps) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title;

    const setMeta = (name: string, content: string) => {
      let el = document.querySelector(`meta[name=\"${name}\"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("name", name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setMeta("description", description);
    if (keywords) setMeta("keywords", keywords);

    // OpenGraph
    const setOg = (prop: string, content: string) => {
      let el = document.querySelector(`meta[property=\"${prop}\"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("property", prop);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setOg("og:title", title);
    setOg("og:description", description);

    // JSON-LD LocalBusiness with areaServed (cities)
    const ldId = "seo-localbusiness-jsonld";
    let script = document.getElementById(ldId) as HTMLScriptElement | null;
    const ld = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: title,
      description,
      url: window.location.origin,
      areaServed: cities,
      sameAs: [window.location.origin + "/impressum"]
    };

    if (!script) {
      script = document.createElement("script");
      script.id = ldId;
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.text = JSON.stringify(ld);

    return () => {
      document.title = prevTitle;
    };
  }, [title, description, keywords, cities]);

  return null;
}
