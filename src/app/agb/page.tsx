export default function AgbPage() {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <header className="mb-8">
        <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Rechtliches</p>
        <h1 className="mt-3 text-4xl font-display font-semibold text-gray-900">
          Allgemeine Geschäftsbedingungen
        </h1>
        <p className="mt-2 text-gray-600">Stand: Mai 2025</p>
      </header>

      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">§ 1 Geltungsbereich</h2>
          <p className="text-gray-600 leading-relaxed">
            Diese Allgemeinen Geschäftsbedingungen gelten für die Nutzung der Sprachlernplattform Linglet
            (linglet.app), betrieben von Hendrik Beier, Schützenstraße 18, 12165 Berlin. Mit der Registrierung
            eines Kontos akzeptierst du diese Bedingungen in ihrer jeweils gültigen Fassung.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">§ 2 Vertragsschluss und Registrierung</h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            Ein Nutzungsverhältnis entsteht mit der erfolgreichen Registrierung auf der Plattform. Du musst
            mindestens 16 Jahre alt sein, um Linglet nutzen zu dürfen.
          </p>
          <p className="text-gray-600 leading-relaxed mb-3">
            Du verpflichtest dich, bei der Registrierung korrekte und vollständige Angaben zu machen und deine
            Zugangsdaten (insbesondere das Passwort) vertraulich zu behandeln.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Jede natürliche Person darf nur ein Konto anlegen.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">§ 3 Kostenlose und Premium-Nutzung</h2>

          <h3 className="font-semibold text-gray-800 mt-2 mb-2">Free-Plan</h3>
          <p className="text-gray-600 leading-relaxed mb-3">
            Die Basisnutzung von Linglet ist kostenlos. Der kostenlose Zugang ist auf bestimmte Kapitel und
            Funktionen beschränkt (aktuell: maximal 3 Kapitel, 5 Unterkapitel pro Tag).
          </p>

          <h3 className="font-semibold text-gray-800 mt-4 mb-2">Premium-Plan</h3>
          <p className="text-gray-600 leading-relaxed mb-3">
            Der Premium-Zugang hebt alle Limits auf und gibt Zugang zu sämtlichen Inhalten der Plattform. Der
            jeweils aktuelle Preis wird auf der Upgrade-Seite angezeigt.
          </p>

          <p className="text-gray-600 leading-relaxed">
            Der Leistungsumfang beider Pläne kann vom Anbieter angepasst werden. Wesentliche Einschränkungen
            werden mit mindestens 30 Tagen Vorankündigung per E-Mail mitgeteilt.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">§ 4 Zahlung und Kündigung (Premium)</h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            Premium-Abonnements werden monatlich oder jährlich im Voraus abgerechnet.
          </p>
          <p className="text-gray-600 leading-relaxed mb-3">
            Die Kündigung ist jederzeit zum Ende der bereits bezahlten Periode möglich. Nach der Kündigung läuft
            der Premium-Zugang bis zum Ende des bezahlten Zeitraums weiter.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Rückerstattungen sind innerhalb von 14 Tagen nach Ersterwerb möglich (gesetzliches Widerrufsrecht,
            §§ 355 ff. BGB), sofern kein Ausschlussgrund nach § 356 Abs. 5 BGB vorliegt.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">§ 5 Widerrufsrecht</h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            Du hast das Recht, binnen 14 Tagen ohne Angabe von Gründen von einem Vertrag über digitale Inhalte
            zu widerrufen. Die Widerrufsfrist beträgt 14 Tage ab dem Tag des Vertragsschlusses.
          </p>
          <p className="text-gray-600 leading-relaxed mb-3">
            Um dein Widerrufsrecht auszuüben, teile uns deine Entscheidung per E-Mail an{' '}
            <a href="mailto:support@hendrik.tech" className="text-indigo-600 hover:underline">
              support@hendrik.tech
            </a>{' '}
            mit.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Das Widerrufsrecht erlischt bei Verträgen über die Lieferung von digitalen Inhalten vorzeitig, wenn
            du ausdrücklich zugestimmt hast, dass wir mit der Ausführung des Vertrags vor Ablauf der
            Widerrufsfrist beginnen, und du zur Kenntnis genommen hast, dass du dein Widerrufsrecht damit verlierst.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">§ 6 Nutzungsrechte und Urheberrecht</h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            Alle Inhalte der Plattform (Lernmaterial, Design, Code, Grafiken) sind Eigentum von Hendrik Beier
            oder werden von ihm lizenziert genutzt. Vervielfältigung, Weiterverbreitung oder kommerzielle Nutzung
            ist ohne ausdrückliche schriftliche Genehmigung untersagt.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Du erhältst für die Dauer des Nutzungsverhältnisses ein persönliches, nicht übertragbares Recht zur
            Nutzung der Plattform ausschließlich für private Lernzwecke.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">§ 7 Verhaltensregeln</h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            Die Nutzung der Plattform für illegale Zwecke, zur Verbreitung von Spam oder schädlichen Inhalten
            ist untersagt.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Das automatisierte Auslesen von Inhalten (Scraping) sowie jegliche Maßnahmen, die die
            Infrastruktur der Plattform beeinträchtigen könnten, sind ausdrücklich verboten.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">§ 8 Haftung</h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            Linglet wird „wie gesehen" (as-is) bereitgestellt. Wir übernehmen keine Garantie für eine ununterbrochene
            oder fehlerfreie Verfügbarkeit der Plattform.
          </p>
          <p className="text-gray-600 leading-relaxed mb-3">
            Für direkte Schäden haften wir nur bei Vorsatz und grober Fahrlässigkeit. Die Haftung für indirekte
            Schäden, entgangenen Gewinn oder Datenverlust ist ausgeschlossen, soweit gesetzlich zulässig.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Die Haftung für Personenschäden sowie nach dem Produkthaftungsgesetz bleibt von diesen
            Beschränkungen unberührt.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">§ 9 Kontolöschung und Kündigung durch uns</h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            Du kannst dein Konto jederzeit in den Einstellungen der Plattform löschen. Alle mit deinem Konto
            verbundenen personenbezogenen Daten werden gemäß unserer Datenschutzerklärung gelöscht.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Wir behalten uns vor, Konten bei schwerwiegenden oder wiederholten Verstößen gegen diese AGB ohne
            vorherige Ankündigung zu sperren oder dauerhaft zu löschen.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">§ 10 Änderungen der AGB</h2>
          <p className="text-gray-600 leading-relaxed">
            Änderungen dieser AGB werden dir per E-Mail an die hinterlegte Adresse angekündigt. Wenn du den
            Änderungen nicht innerhalb von 30 Tagen nach Ankündigung widersprichst, gelten die neuen AGB als
            angenommen. Auf dieses Widerspruchsrecht und die Folge des Schweigens werden wir in der
            Ankündigung ausdrücklich hinweisen.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">§ 11 Anwendbares Recht und Gerichtsstand</h2>
          <p className="text-gray-600 leading-relaxed">
            Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts. Gerichtsstand
            für alle Streitigkeiten aus oder im Zusammenhang mit diesem Vertrag ist Berlin, sofern gesetzlich
            zulässig und kein zwingender Verbrauchergerichtsstand entgegensteht.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">§ 12 Salvatorische Klausel</h2>
          <p className="text-gray-600 leading-relaxed">
            Sollten einzelne Bestimmungen dieser AGB ganz oder teilweise unwirksam sein oder werden, berührt
            dies die Wirksamkeit der übrigen Bestimmungen nicht. Anstelle der unwirksamen Bestimmung gilt die
            gesetzliche Regelung.
          </p>
        </div>
      </div>
    </div>
  );
}
