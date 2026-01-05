import React from "react";

const CITIES = [
  "Heilbronn",
  "Stuttgart",
  "München",
  "Berlin",
  "Hamburg",
  "Köln",
  "Frankfurt am Main",
  "Düsseldorf",
  "Dortmund",
  "Essen",
  "Leipzig",
  "Nürnberg",
  "Hannover",
  "Bremen",
  "Karlsruhe",
  "Mannheim",
  "Freiburg",
  "Augsburg",
  "Wiesbaden",
  "Mainz",
  "Bonn",
  "Münster",
  "Rostock",
  "Kiel",
  "Lübeck",
  "Potsdam",
  "Ulm",
  "Regensburg",
  "Saarbrücken",
  "Bielefeld",
  "Chemnitz",
  "Halle",
  "Erfurt",
  "Magdeburg",
  "Oldenburg",
];

export default function CitySeoList() {
  return (
    <section className="container mx-auto max-w-5xl px-6 py-12">
      <h2 className="text-2xl font-semibold mb-4">Günstige Webseite in Ihrer Stadt</h2>
      <p className="text-muted-foreground mb-6">Wir erstellen günstige Webseiten für lokale Unternehmen — schnell, modern und suchmaschinenoptimiert.</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {CITIES.map((c) => (
          <a key={c} href="#contact" className="block p-3 border border-border rounded hover:bg-muted transition-colors text-sm">
            Günstige Webseite in {c}
          </a>
        ))}
      </div>
    </section>
  );
}
