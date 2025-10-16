# Cypress Tag 1 Arbeitsblatt zur Vertiefung der E2E-Fähigkeiten

Die Referenz-App „KfW Mini-Förderportal“ wurde gezielt für die Cypress-Lernreise aufgebaut: Modul 1 stellt die stabilen `data-testid`-Anker und berechenbaren Routen vor, Modul 2 erläutert die automatisch erneut ausgeführten Kommandos sowie die Ergonomie des Runners, und Modul 3–4 verbinden die kontrollierte Mock-Umgebung mit disziplinierter Test-Anatomie. Die folgenden Übungen greifen diese Anker und Prinzipien auf, damit du realistische Browser-Flows trainierst und gleichzeitig Cypress-Idiome einübst, die die Suite schnell, ausdrucksstark und wartbar halten.

## Übung 1 — Smoke-Tests für die Kernnavigation stabil halten
**Szenariokontext.** Ein Release-Kandidat soll sofort durchfallen, wenn das Landing-Shell oder der Programme-Link verschwindet; das Produktteam betrachtet diesen Pfad als Gold-Route.
**Erwartetes Testergebnis.** Weisen Sie nach, dass ein Besuch der Root-Route die Shell lädt und dass ein Klick auf das Navigationsziel „Programme“ den Marker der Programme-Seite ohne fragile CSS-Pfade sichtbar macht.
**Cypress-Schwerpunkt.**
- `cy.visit` mit `baseUrl`-Konfiguration aus Modul 3.
- Stabile Test-Hooks aus Modul 1 (`app-shell`, `app-nav`, `nav-link-programs`, `programs-page`).
- Automatisches Wiederholen von Sichtbarkeits-Assertions aus Modul 2.
**Hinweise für Umsteiger:innen.** Statt imperative Wartezeiten aus anderen Tools zu übersetzen, beschreibe Zielzustände (z. B. Header ist sichtbar, Programme-Marker ist gerendert). Cypress wiederholt die Befehle selbstständig, also widerstehe dem Drang, Sleep-Aufrufe aus async/await-Gewohnheiten zu übernehmen. Kombiniere `contains` mit einem Navigations-Scope, um doppelte Labels eindeutig anzusprechen.

## Übung 2 — Netzwerklatenz beobachten, ohne Sleep zu verwenden
**Szenariokontext.** Programmdaten laden gelegentlich langsamer; Stakeholder möchten sicherstellen, dass die UI bei künstlicher Verzögerung benutzbar bleibt.
**Erwartetes Testergebnis.** Erkenne den Lazy-Loading-Spinner, solange die Programmliste auf die gemockte API wartet, und bestätige anschließend, dass die Liste nach dem abgefangenen Request erscheint.
**Cypress-Schwerpunkt.**
- Query-Parameter oder Header-Schalter für Delay/Error (Modul 1 zum Mock-Layer).
- `cy.intercept` mit Alias und `cy.wait`-Verkettung aus Modul 2.
- Snapshot-Analyse im Runner, um den Lebenszyklus des Spinners sichtbar zu machen.
**Hinweise für Umsteiger:innen.** In imperativen Testframeworks ist es üblich, fixe Wartezeiten aneinanderzureihen; hier lässt du Cypress auf den benannten Netzwerk-Alias warten. Halte Assertions fokussiert (Spinner existiert → verschwindet → Liste ist sichtbar) und denke daran, dass Cypress Subjekte automatisch aktualisiert – manueller Promise-Code ist nicht nötig.

## Übung 3 — Login-Rückmeldungen positiv und negativ absichern
**Szenariokontext.** Die Login-Route muss sowohl bei korrekten als auch bei zurückgewiesenen Anmeldedaten klare Rückmeldungen zeigen, damit Support-Teams den Status vertrauen können.
**Erwartetes Testergebnis.** Decke einen Happy Path ab, der zum Ziel nach dem Login führt, sowie einen negativen Pfad, der ein Alert mit `aria-invalid`-Semantik sichtbar macht, ohne Selektoren zu duplizieren.  
**Cypress-Schwerpunkt.**
- Guard-Assertions und Arrange-Act-Assert-Struktur aus Modul 4.
- Formularinteraktionen (clear, type, blur) und a11y-Checks.
- Gemockte Authentifizierungs-Handler gemäß Modul 3.
**Hinweise für Umsteiger:innen.** Bewahre Isolation: Jeder Test startet bei `/login`, statt wie in manchen Unit-Frameworks auf Vorzustände zu bauen. Unterdrücke Log-Ausgaben für Passwörter (`{ log: false }`), damit Berichte sauber bleiben. Wenn du DOM-Text ausliest, nutze `then` nur, wenn du wirklich weiterverarbeiten musst – `should` kümmert sich bereits um das Timing.

## Übung 4 — API-Fehler gezielt sichtbar machen
**Szenariokontext.** Backoffice-Nutzer benötigen aussagekräftige Hinweise, wenn der Applications-Endpunkt fehlschlägt; QA verlangt den Nachweis, dass Alerts erscheinen und die Navigation stabil bleibt.  
**Erwartetes Testergebnis.** Erzwinge eine 500er-Antwort über den MSW-Schalter, verifiziere ein sichtbares `role="alert"` mit Kontexttext und stelle sicher, dass die Route unverändert bleibt.  
**Cypress-Schwerpunkt.**
- Request-Header zur Steuerung des MSW-Simulators (Modul 3).
- Mehrere Assertions zu DOM-Sichtbarkeit und `cy.location('pathname')`.
- Runner-Time-Travel, um die Snapshot-Kopie zu prüfen.  
**Hinweise für Umsteiger:innen.** Statt Exceptions wie im Code abzufangen, validierst du sichtbare UI-Ergebnisse. Begrenze Assertions auf den Seiten-Root, um Fehlalarme zu vermeiden, und nutze case-insensitive Muster für übersetzte Texte. Cypress erzeugt bei Fehlern automatisch Artefakte, zusätzliche Screenshots brauchst du nur bei besonderen Zwischenständen.

## Übung 5 — Denken in Command-Queues mit abgeleiteten Daten trainieren
**Szenariokontext.** Die Programme-Seite rendert dynamische Karten; Stakeholder wünschen einen Count-basierten Smoke-Check mit erklärenden Logs bei Abweichungen.  
**Erwartetes Testergebnis.** Hole die Liste der Programmkarten, prüfe eine Mindestanzahl und schreibe eine hilfreiche Log-Nachricht mit diesem Wert – ohne DOM-Knoten in externe Variablen auszulagern.  
**Cypress-Schwerpunkt.**
- `its`, `should`-Callbacks und `then` zur kontrollierten Nachbearbeitung (Modul 2 über die Architektur).
- Gezieltes `cy.log`, um Runner-Ausgaben zu kommentieren (Modul 4 „Fehler sichtbar machen“).
- Vermeidung falscher `await`-Muster durch Verbleib in der Cypress-Kette.  
**Hinweise für Umsteiger:innen.** Behandle Chainables als verzögerte Werte: Statt mutable Variablen zu befüllen, nutze die Callback-Signaturen, die Cypress bereitstellt. Wenn du auf Basis der Anzahl verzweigen musst, gib Werte aus `then` zurück, damit die Kette im Cypress-Scheduler synchron bleibt. Das erinnert an Promise-Chaining, ohne die Steuerung aus der Hand zu geben.

## Übung 6 — Wiederverwendbare Navigation und Hooks kodifizieren
**Szenariokontext.** Viele Specs starten auf der Landing Page und wechseln in Sekundärrouten; dupliziertes Arrange ist fehleranfällig.  
**Erwartetes Testergebnis.** Lege ein Custom Command oder einen `beforeEach`-Helper an, der die Navigation zu „Programme“ kapselt, und nutze ihn in mindestens zwei Tests, während die Assertions jeweils lokal bleiben.  
**Cypress-Schwerpunkt.**
- Support-Kommandos, die `cy`-Chainables zurückgeben (Modul 4 „Small Refactors“).
- `beforeEach` für geteiltes Arrange ohne versteckte Act/Assert-Blöcke.
- Aliase zur Scope-Klärung und zum Reduzieren von Selektor-Wiederholungen.  
**Hinweise für Umsteiger:innen.** Halte Abstraktionen schmal und assertionsfrei, damit einzelne Tests weiterhin die Quelle der Wahrheit sind. Wenn du aus der Unit-Test-Welt Inheritance oder Mixins gewohnt bist, setze hier lieber auf diese leichten Helfer – sie integrieren sich sauber in die Cypress-Queue und verhindern implizite Test-Abhängigkeiten.

## Reflexionsfragen
- Vergleiche das Auto-Retry und die Command-Queue von Cypress mit den synchronen oder expliziten Warte-Modellen, die du bisher genutzt hast. Welche mentalen Umstellungen waren am bedeutendsten?
- Welche Selektoren oder Hooks haben dein Vertrauen gestärkt? Wie beeinflusst der Fokus aus Modul 1 auf `data-testid`-Verträge deine Test-Backlog-Prioritäten?
- Notiere Momente, in denen du über feste Sleeps oder erzwungene Klicks nachgedacht hast. Welche Alternativen aus dem Trainingsdeck hast du stattdessen angewendet?
- Formuliere zwei Experimente, die du als Nächstes starten möchtest (z. B. `cy.intercept` weiter ausbauen, `cy.session` für Login-Caching prüfen oder Accessibility-Assertions ergänzen) und halte offene Fragen fest, die du morgen im Team klären willst.