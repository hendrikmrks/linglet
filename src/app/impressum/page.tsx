export default function ImpressumPage() {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <header className="mb-8">
        <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Rechtliches</p>
        <h1 className="mt-3 text-4xl font-display font-semibold text-gray-900">Impressum</h1>
        <p className="mt-2 text-gray-600">Stand: Mai 2025</p>
      </header>

      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Angaben gemäß § 5 TMG</h2>
          <p className="text-gray-600 leading-relaxed">
            Hendrik Beier<br />
            Schützenstraße 18<br />
            12165 Berlin<br />
            Deutschland
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Kontakt</h2>
          <p className="text-gray-600 leading-relaxed">
            E-Mail:{' '}
            <a href="mailto:support@hendrik.tech" className="text-indigo-600 hover:underline">
              support@hendrik.tech
            </a>
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Hendrik Beier<br />
            Schützenstraße 18<br />
            12165 Berlin<br />
            Deutschland
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">EU-Streitschlichtung</h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{' '}
            <a
              href="https://ec.europa.eu/consumers/odr/"
              className="text-indigo-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://ec.europa.eu/consumers/odr/
            </a>
          </p>
          <p className="text-gray-600 leading-relaxed">
            Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
            Verbraucherschlichtungsstelle teilzunehmen.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Haftung für Inhalte</h2>
          <p className="text-gray-600 leading-relaxed">
            Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten nach den
            allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht
            verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu
            forschen, die auf eine rechtswidrige Tätigkeit hinweisen. Verpflichtungen zur Entfernung oder Sperrung
            der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine
            diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung
            möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend
            entfernen.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Haftung für Links</h2>
          <p className="text-gray-600 leading-relaxed">
            Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben.
            Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der
            verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die
            verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft.
            Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar. Eine permanente inhaltliche
            Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht
            zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.
          </p>
        </div>
      </div>
    </div>
  );
}
