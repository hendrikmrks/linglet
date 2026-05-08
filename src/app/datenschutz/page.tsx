export default function DatenschutzPage() {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <header className="mb-8">
        <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Rechtliches</p>
        <h1 className="mt-3 text-4xl font-display font-semibold text-gray-900">Datenschutzerklärung</h1>
        <p className="mt-2 text-gray-600">Stand: Mai 2025 · gemäß DSGVO (Art. 13 DSGVO)</p>
      </header>

      <div className="space-y-6">
        {/* 1. Verantwortlicher */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            1. Verantwortlicher (Art. 13 Abs. 1 lit. a DSGVO)
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Hendrik Beier<br />
            Schützenstraße 18<br />
            12165 Berlin<br />
            Deutschland<br />
            E-Mail:{' '}
            <a href="mailto:support@hendrik.tech" className="text-indigo-600 hover:underline">
              support@hendrik.tech
            </a>
          </p>
        </div>

        {/* 2. Erhobene Daten und Zwecke */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            2. Erhobene Daten und Zwecke (Art. 13 Abs. 1 lit. c, d DSGVO)
          </h2>

          <h3 className="font-semibold text-gray-800 mt-4 mb-2">Registrierungsdaten</h3>
          <p className="text-gray-600 leading-relaxed mb-3">
            Name, E-Mail-Adresse und Passwort (verschlüsselt mit bcrypt gespeichert). Zweck: Kontoerstellung und
            Authentifizierung. Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung).
          </p>

          <h3 className="font-semibold text-gray-800 mt-4 mb-2">Lernfortschrittsdaten</h3>
          <p className="text-gray-600 leading-relaxed mb-3">
            Abgeschlossene Lektionen, XP-Punkte, Streak-Tage und Badges. Zweck: Bereitstellung der
            Lernfunktionen. Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung).
          </p>

          <h3 className="font-semibold text-gray-800 mt-4 mb-2">Profilbild (optional)</h3>
          <p className="text-gray-600 leading-relaxed mb-3">
            Wenn du ein Profilbild hochlädst, wird es auf unserem Server gespeichert. Das Hochladen ist freiwillig.
            Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO (Einwilligung).
          </p>

          <h3 className="font-semibold text-gray-800 mt-4 mb-2">Server-Logfiles</h3>
          <p className="text-gray-600 leading-relaxed">
            Beim Zugriff auf unsere Plattform werden automatisch IP-Adresse, Browser-Typ und Zugriffszeit
            protokolliert. Zweck: Sicherheit und Fehlerbehebung. Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO
            (berechtigte Interessen).
          </p>
        </div>

        {/* 3. Cookies und Session-Daten */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Cookies und Session-Daten</h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            Wir verwenden ausschließlich technisch notwendige Session-Cookies (HttpOnly) zur Aufrechterhaltung
            deiner Anmeldung. Es werden keine Tracking-Cookies, Analyse-Cookies oder Werbe-Cookies eingesetzt.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Da wir ausschließlich notwendige Cookies verwenden, ist kein Cookie-Banner erforderlich.
          </p>
        </div>

        {/* 4. Weitergabe an Dritte */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Weitergabe an Dritte</h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            Eine Weitergabe deiner personenbezogenen Daten an Dritte findet nicht statt. Wir setzen keine
            externen Analyse-, Werbe- oder Social-Media-Dienste ein.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Hinweis: Bei zukünftiger Zahlungsabwicklung via Stripe werden Zahlungsdaten direkt von Stripe
            verarbeitet. Stripe agiert dabei als eigenverantwortlicher Anbieter und unterliegt eigenen
            Datenschutzrichtlinien. Wir selbst speichern keine Zahlungsdaten.
          </p>
        </div>

        {/* 5. Speicherdauer */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            5. Speicherdauer (Art. 13 Abs. 2 lit. a DSGVO)
          </h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Kontodaten werden gelöscht, sobald du dein Konto löschst oder eine Löschung per E-Mail anforderst.</li>
            <li>Server-Logfiles werden nach spätestens 30 Tagen automatisch gelöscht.</li>
            <li>
              Bei gesetzlichen Aufbewahrungspflichten (z. B. Rechnungsdaten nach § 147 AO) bis zu 10 Jahre.
            </li>
          </ul>
        </div>

        {/* 6. Deine Rechte */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            6. Deine Rechte (Art. 13 Abs. 2 lit. b–d DSGVO)
          </h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            Du hast gegenüber uns folgende Rechte hinsichtlich deiner personenbezogenen Daten:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
            <li>
              <span className="font-medium text-gray-700">Auskunft (Art. 15 DSGVO):</span>{' '}
              Welche Daten wir über dich gespeichert haben.
            </li>
            <li>
              <span className="font-medium text-gray-700">Berichtigung (Art. 16 DSGVO):</span>{' '}
              Korrektur unrichtiger oder unvollständiger Daten.
            </li>
            <li>
              <span className="font-medium text-gray-700">Löschung (Art. 17 DSGVO):</span>{' '}
              Löschung deiner Daten — jederzeit über „Konto löschen" in den Einstellungen oder per E-Mail.
            </li>
            <li>
              <span className="font-medium text-gray-700">Einschränkung (Art. 18 DSGVO):</span>{' '}
              Einschränkung der Verarbeitung deiner Daten.
            </li>
            <li>
              <span className="font-medium text-gray-700">Widerspruch (Art. 21 DSGVO):</span>{' '}
              Widerspruch gegen die Verarbeitung deiner Daten.
            </li>
            <li>
              <span className="font-medium text-gray-700">Datenübertragbarkeit (Art. 20 DSGVO):</span>{' '}
              Herausgabe deiner Daten in einem gängigen, maschinenlesbaren Format auf Anfrage.
            </li>
          </ul>
          <p className="text-gray-600 leading-relaxed">
            Du hast außerdem das Recht, dich bei der zuständigen Datenschutzbehörde zu beschweren. Zuständige
            Aufsichtsbehörde:{' '}
            <a
              href="https://www.datenschutz-berlin.de"
              className="text-indigo-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Berliner Beauftragte für Datenschutz und Informationsfreiheit
            </a>
            .
          </p>
        </div>

        {/* 7. Datensicherheit */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Datensicherheit</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Passwörter werden mit bcrypt gehasht gespeichert und nie im Klartext übertragen oder gespeichert.</li>
            <li>Alle Verbindungen zur Plattform sind SSL/TLS-verschlüsselt.</li>
            <li>Session-Cookies sind mit den Flags HttpOnly und Secure gesetzt.</li>
            <li>Die Plattform wird auf einem eigenen Server in der EU betrieben.</li>
          </ul>
        </div>

        {/* 8. Kontakt bei Datenschutzfragen */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Kontakt bei Datenschutzfragen</h2>
          <p className="text-gray-600 leading-relaxed">
            Bei Fragen zum Datenschutz wende dich bitte an:{' '}
            <a href="mailto:support@hendrik.tech" className="text-indigo-600 hover:underline">
              support@hendrik.tech
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
