import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { useEffect } from "react";
import { Code2, MapPin, Phone, Mail } from "lucide-react";

export default function Datenschutz() {
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
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">Datenschutzerklärung</h1>
            <p className="text-muted-foreground mt-2">Stand: {new Date().getFullYear()}</p>
          </div>
        </div>
            <div className="grid gap-6">
              <section className="bg-card/80 p-6 rounded-2xl border border-border/20">
                <h2 className="text-xl font-semibold mb-3">Datenschutzerklärung</h2>
                <p className="text-muted-foreground">Informationen über die Verarbeitung Ihrer personenbezogenen Daten</p>
              </section>

              <section className="bg-card/80 p-6 rounded-2xl border border-border/20">
                <h3 className="text-lg font-semibold mb-2">Allgemeine Hinweise</h3>
                <p className="text-muted-foreground">Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.</p>
              </section>

              <section className="bg-card/80 p-6 rounded-2xl border border-border/20">
                <h3 className="text-lg font-semibold mb-2">Verantwortliche Stelle</h3>
                <p className="text-muted-foreground">Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist <strong>Serhat Özden</strong>. Die vollständigen Kontaktdaten finden Sie im Impressum.</p>
              </section>

              <section className="bg-card/80 p-6 rounded-2xl border border-border/20">
                <h3 className="text-lg font-semibold mb-2">Datenerfassung auf dieser Website</h3>
                <p className="text-muted-foreground">Wer ist verantwortlich für die Datenerfassung? Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber <strong>Serhat Özden</strong>. Dessen Kontaktdaten können Sie dem Impressum dieser Website entnehmen.</p>
                <p className="mt-2 text-muted-foreground">Wie erfassen wir Ihre Daten? Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann es sich z.B. um Daten handeln, die Sie in ein Kontaktformular eingeben. Andere Daten werden automatisch beim Besuch der Website durch unsere IT-Systeme erfasst. Das sind vor allem technische Daten (z.B. Internetbrowser, Betriebssystem oder Uhrzeit des Seitenaufrufs).</p>
                <p className="mt-2 text-muted-foreground">Wofür nutzen wir Ihre Daten? Ein Teil der Daten wird erhoben, um eine fehlerfreie Bereitstellung der Website zu gewährleisten und die Sicherheit unserer IT-Systeme zu gewährleisten.</p>
                <p className="mt-2 text-muted-foreground">Hinweis zu Social‑Media‑Links: Das Instagram‑Icon auf dieser Website ist lediglich eine Verlinkung zu unserem Instagram‑Profil. Es handelt sich dabei nicht um ein eingebettetes Plugin oder Widget von Instagram und es werden durch das Icon selbst keine Daten an Instagram übertragen oder externe Skripte/Cookies geladen. Erst wenn Sie dem Link folgen und die Instagram‑Seite besuchen, gelten die Datenschutzbestimmungen von Instagram.</p>
              </section>

              <section className="bg-card/80 p-6 rounded-2xl border border-border/20">
                <h3 className="text-lg font-semibold mb-2">Hosting und Content Delivery Networks (CDN)</h3>
                <p className="text-muted-foreground">Diese Website wird bei <strong>STRATO AG</strong> (Otto-Lilienthal-Straße 1, 31135 Hildesheim, Deutschland) gehostet. Der Hoster verarbeitet in unserem Auftrag alle Daten, die auf dieser Website verarbeitet werden oder über die Website erhoben werden. Dies ist insbesondere zur Bereitstellung der Website, Gewährleistung von Stabilität und Sicherheit erforderlich.</p>
                <p className="mt-2 text-muted-foreground">Die Nutzung von STRATO erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO. Wir haben ein berechtigtes Interesse an einer technisch einwandfreien und optimierten Bereitstellung unserer Website. Wir haben mit der STRATO AG einen Vertrag über Auftragsverarbeitung (AVV) abgeschlossen, der sicherstellt, dass die Daten unserer Website-Besucher nur nach unseren Weisungen und unter Einhaltung der DSGVO verarbeitet werden.</p>
              </section>

              <section className="bg-card/80 p-6 rounded-2xl border border-border/20">
                <h3 className="text-lg font-semibold mb-2">Server-Log-Dateien</h3>
                <p className="text-muted-foreground">Der Provider der Seiten (STRATO) erhebt und speichert automatisch Informationen in so genannten Server-Log-Dateien, die Ihr Browser automatisch an uns übermittelt. Dies sind unter anderem Browsertyp und -version, verwendetes Betriebssystem, Referrer URL, Hostname des zugreifenden Rechners, Uhrzeit der Serveranfrage und die IP-Adresse. Eine Zusammenführung dieser Daten mit anderen Datenquellen wird nicht vorgenommen. Die Erfassung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO zur Gewährleistung der technischen Sicherheit und Optimierung unserer Dienste.</p>
              </section>

              <section className="bg-card/80 p-6 rounded-2xl border border-border/20">
                <h3 className="text-lg font-semibold mb-2">Cookies</h3>
                <p className="text-muted-foreground">Diese Website verwendet keine Cookies. Wir setzen weder technisch notwendige Cookies noch Cookies zu Analyse-, Marketing- oder Trackingzwecken ein. Es werden keine Informationen in Ihrem Browser gespeichert, und es erfolgt keine Nachverfolgung Ihres Nutzerverhaltens über Cookies oder ähnliche Technologien. Die Website funktioniert vollständig ohne den Einsatz von Cookies. Ihre Privatsphäre wird somit maximal geschützt.</p>
              </section>

              <section className="bg-card/80 p-6 rounded-2xl border border-border/20">
                <h3 className="text-lg font-semibold mb-2">Kontaktformular</h3>
                <p className="text-muted-foreground">Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter. Die Verarbeitung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO, sofern Ihre Anfrage mit der Erfüllung eines Vertrags zusammenhängt oder zur Durchführung vorvertraglicher Maßnahmen erforderlich ist.</p>
              </section>

              <section className="bg-card/80 p-6 rounded-2xl border border-border/20">
                <h3 className="text-lg font-semibold mb-2">Ihre Rechte</h3>
                <p className="text-muted-foreground">Sie haben jederzeit das Recht auf unentgeltliche Auskunft über Ihre gespeicherten personenbezogenen Daten, deren Herkunft und Empfänger und den Zweck der Datenverarbeitung sowie ein Recht auf Berichtigung oder Löschung dieser Daten.</p>
                <ul className="list-disc pl-5 mt-3 text-muted-foreground space-y-1">
                  <li>Auskunftsrecht: Sie können Auskunft über Ihre bei uns gespeicherten Daten verlangen</li>
                  <li>Berichtigungsrecht: Sie können die Berichtigung unrichtiger Daten verlangen</li>
                  <li>Löschungsrecht: Sie können die Löschung Ihrer Daten verlangen</li>
                  <li>Einschränkung der Verarbeitung: Sie können die Einschränkung der Verarbeitung verlangen</li>
                  <li>Datenübertragbarkeit: Sie haben das Recht auf Datenübertragbarkeit</li>
                  <li>Widerspruchsrecht: Sie können der Verarbeitung Ihrer Daten widersprechen</li>
                  <li>Beschwerderecht: Sie können sich bei einer Aufsichtsbehörde beschweren, insbesondere bei der für uns zuständigen Aufsichtsbehörde: Der Landesbeauftragte für den Datenschutz und die Informationsfreiheit Baden-Württemberg (Postfach 10 29 32, 70025 Stuttgart).</li>
                </ul>
                <p className="mt-3 text-muted-foreground">Kontakt: Für Fragen zum Datenschutz wenden Sie sich bitte an: <a className="underline text-primary" href="mailto:oezdens.web@outlook.de">oezdens.web@outlook.de</a></p>
              </section>

              <section className="bg-card/80 p-6 rounded-2xl border border-border/20">
                <h3 className="text-lg font-semibold mb-2">SSL- bzw. TLS-Verschlüsselung</h3>
                <p className="text-muted-foreground">Diese Seite nutzt aus Sicherheitsgründen und zum Schutz der Übertragung vertraulicher Inhalte, wie zum Beispiel Bestellungen oder Anfragen, die Sie an uns als Seitenbetreiber senden, eine SSL- bzw. TLS-Verschlüsselung. Eine verschlüsselte Verbindung erkennen Sie daran, dass die Adresszeile des Browsers von „http://" auf „https://" wechselt und an dem Schloss-Symbol in Ihrer Browserzeile.</p>
              </section>

              <section className="bg-card/80 p-6 rounded-2xl border border-border/20">
                <h3 className="text-lg font-semibold mb-2">Speicherdauer</h3>
                <p className="text-muted-foreground">Soweit innerhalb dieser Datenschutzerklärung keine speziellere Speicherdauer genannt wurde, verbleiben Ihre personenbezogenen Daten bei uns, bis der Zweck für die Datenverarbeitung entfällt. Wenn Sie ein berechtigtes Löschersuchen geltend machen oder eine Einwilligung zur Datenverarbeitung widerrufen, werden Ihre Daten gelöscht, sofern wir keine anderen rechtlich zulässigen Gründe für die Speicherung Ihrer personenbezogenen Daten haben.</p>
              </section>
          </div>
        </main>

      <Footer />
    </div>
  );
}
