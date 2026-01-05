import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { useEffect } from "react";
import { Code2, MapPin, Phone, Mail } from "lucide-react";

export default function Impressum() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  return (
    <div className="min-h-screen">
      <Navigation />

      <main className="container mx-auto max-w-5xl px-6 pt-36 pb-24">
        <div className="mb-12 flex items-center gap-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary to-accent flex items-center justify-center text-white">
            <Code2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-4xl font-bold">Impressum</h1>
            <p className="text-muted-foreground mt-2">Angaben gemäß § 5 TMG</p>
          </div>
        </div>

          <div className="grid gap-6">
            <section className="bg-card/80 p-6 rounded-2xl border border-border/20">
              <h2 className="text-xl font-semibold mb-4">Diensteanbieter / Betreiber</h2>
              <div className="space-y-4 text-base text-muted-foreground">
                <div className="font-medium">Serhat Özden</div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-primary to-accent flex items-center justify-center text-white">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div>Bodemstall 6</div>
                    <div>74177 Bad Friedrichshall</div>
                    <div>Deutschland</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-primary to-accent flex items-center justify-center text-white">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <a href="tel:+4915758199741" className="hover:underline">+49 157 58199741</a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-primary to-accent flex items-center justify-center text-white">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <a href="mailto:oezdens.web@outlook.de" className="hover:underline">oezdens.web@outlook.de</a>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-card/80 p-6 rounded-2xl border border-border/20">
              <h2 className="text-xl font-semibold mb-4">Steuerliche Angaben</h2>
              <p className="text-muted-foreground">USt-IdNr.: Kleingewerbetreibend, keine USt-IdNr. vorhanden</p>
            </section>

            <section className="bg-card/80 p-6 rounded-2xl border border-border/20">
              <h2 className="text-xl font-semibold mb-4">Verantwortlich für den Inhalt</h2>
              <p className="text-muted-foreground">Gemäß § 18 Abs. 2 Medienstaatsvertrag (MStV):</p>
              <p className="mt-2">Serhat Özden<br/>Bodemstall 6<br/>74177 Bad Friedrichshall</p>
            </section>

            <section className="bg-card/80 p-6 rounded-2xl border border-border/20">
              <h2 className="text-xl font-semibold mb-4">EU-Streitschlichtung</h2>
              <p className="text-muted-foreground">Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:</p>
              <p className="mt-2"><a className="underline text-primary" href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noreferrer">https://ec.europa.eu/consumers/odr/</a></p>
              <p className="mt-2 text-muted-foreground">Unsere E-Mail-Adresse finden Sie oben im Impressum.</p>
            </section>

            <section className="bg-card/80 p-6 rounded-2xl border border-border/20">
              <h2 className="text-xl font-semibold mb-4">Verbraucherstreitbeilegung / Universalschlichtungsstelle</h2>
              <p className="text-muted-foreground">Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>
            </section>

            <section className="bg-card/80 p-6 rounded-2xl border border-border/20">
              <h2 className="text-xl font-semibold mb-4">Haftungsausschluss</h2>
              <h3 className="font-semibold mt-2">Haftung für Inhalte</h3>
              <p className="text-muted-foreground">Als Diensteanbieter sind wir gemäß § 5 Abs. 1 Digitale-Dienste-Gesetz (DDG) für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 DDG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.</p>

              <h3 className="font-semibold mt-4">Haftung für Links</h3>
              <p className="text-muted-foreground">Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.</p>
            </section>

            <section className="bg-card/80 p-6 rounded-2xl border border-border/20">
              <h2 className="text-xl font-semibold mb-4">Urheberrecht</h2>
              <p className="text-muted-foreground">Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.</p>
            </section>
          </div>
      </main>

      <Footer />
    </div>
  );
}
