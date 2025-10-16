# Cypress Training: Übungsaufgaben

Dieses Dokument enthält eine Reihe von Übungsaufgaben, die dich schrittweise in die Welt des E2E-Testings mit Cypress einführen. Die Aufgaben bauen aufeinander auf und werden zunehmend komplexer.

---

## Level 1: Die Grundlagen – Setup & erste Schritte

In diesem Level installierst du Cypress, schreibst deine ersten Tests und lernst, wie man durch die Anwendung navigiert und grundlegende Überprüfungen durchführt.

### Übung 1: Cypress installieren & starten

**Ziel:** Cypress zum Projekt hinzufügen und den Test Runner erfolgreich öffnen.

**Aufgaben:**

1.  Öffne ein Terminal im `client`-Verzeichnis.
2.  Installiere Cypress als Entwicklung-Abhängigkeit mit `npm`.
3.  Starte den Cypress Test Runner.
4.  Schau dir die Ordnerstruktur an, die Cypress für dich angelegt hat (`cypress/`).

**Hilfreiche Befehle:**

```bash
npm install cypress --save-dev
npx cypress open
```

### Übung 2: Der erste Test – Die Startseite besuchen

**Ziel:** Einen ersten Test schreiben, der die Startseite der Anwendung aufruft und überprüft, ob der Header korrekt geladen wird.

**Aufgaben:**

1.  Erstelle eine neue Test-Datei unter `cypress/e2e/01-smoke.cy.ts`.
2.  Schreibe einen `describe`-Block für deine "Smoke Tests".
3.  Füge einen `it`-Block hinzu, der beschreibt: "sollte die Startseite laden und den Header anzeigen".
4.  Nutze `cy.visit('/')`, um die Startseite zu besuchen.
5.  Verwende `cy.get()` mit dem `data-testid="app-header"`, um den Header zu selektieren.
6.  Füge eine `.should('be.visible')`-Assertion hinzu, um sicherzustellen, dass der Header sichtbar ist.

**Code-Beispiel (zur Orientierung):**

```typescript
describe('Smoke Tests', () => {
  it('sollte die Startseite laden und den Header anzeigen', () => {
    cy.visit('/');
    cy.get('[data-testid="app-header"]').should('be.visible');
  });
});
```

### Übung 3: Navigation testen

**Ziel:** Eine grundlegende Benutzerinteraktion testen: die Navigation zur "Programme"-Seite.

**Aufgaben:**

1.  Füge einen neuen Testfall (einen weiteren `it`-Block) in deiner `01-smoke.cy.ts`-Datei hinzu.
2.  Besuche erneut die Startseite.
3.  Finde den Navigationslink "Programme". Du kannst `cy.contains('Programme')` verwenden.
4.  Klicke auf den Link mit `.click()`.
5.  Überprüfe, ob du dich nun auf der "Programme"-Seite befindest. Selektiere dazu das Seitenelement (`data-testid="programs-page"`) und prüfe dessen Sichtbarkeit.

### Übung 4: Die 404-Seite überprüfen

**Ziel:** Sicherstellen, dass die Anwendung eine dedizierte "Seite nicht gefunden"-Seite anzeigt, wenn eine ungültige URL aufgerufen wird.

**Aufgaben:**

1.  Erstelle einen weiteren Testfall.
2.  Besuche eine Route, die es nicht gibt, z. B. `/diese-seite-gibt-es-nicht`.
3.  Überprüfe, ob das Element mit `data-testid="not-found-page"` sichtbar ist.

---

## Level 2: Interaktionen & fortgeschrittene Assertions

Jetzt gehen wir einen Schritt weiter: Wir interagieren mit Formularelementen und prüfen spezifische Zustände wie CSS-Klassen oder Attribute.

### Übung 5: Den aktiven Navigations-Zustand prüfen

**Ziel:** Testen, ob der aktuell aktive Navigationslink korrekt hervorgehoben wird.

**Aufgaben:**

1.  Erstelle eine neue Test-Datei `cypress/e2e/02-navigation.cy.ts`.
2.  Schreibe einen Test, der zur "Programme"-Seite navigiert.
3.  Überprüfe, ob der "Programme"-Link (`data-testid="nav-link-programs"`) die CSS-Klasse `app-nav-link--active` enthält.
    - **Tipp:** Nutze die Assertion `.should('have.class', 'app-nav-link--active')`.
4.  **Bonus:** Schreibe einen zweiten Test, der prüft, dass der "Home"-Link diese Klasse *nicht* hat, wenn man auf der "Programme"-Seite ist.

### Übung 6: Formular-Eingaben simulieren

**Ziel:** Das Ausfüllen des Login-Formulars testen.

**Aufgaben:**

1.  Erstelle eine neue Test-Datei `cypress/e2e/03-login-form.cy.ts`.
2.  Besuche die Login-Seite (`/login`).
3.  Selektiere das E-Mail-Input-Feld (`data-testid="login-email"`).
4.  Nutze `.type('test@example.com')`, um eine E-Mail-Adresse einzugeben.
5.  Überprüfe mit `.should('have.value', 'test@example.com')`, ob der eingegebene Wert korrekt ist.
6.  Wiederhole die Schritte 3-5 für das Passwort-Feld (`data-testid="login-password"`) mit einem Test-Passwort.

### Übung 7: Scoping mit `within`

**Ziel:** Wiederholungen im Code reduzieren und Tests lesbarer machen, indem du Befehle auf einen bestimmten DOM-Bereich beschränkst.

**Aufgaben:**

1.  Refaktoriere den Test aus **Übung 5**.
2.  Selektiere zuerst die gesamte Navigation (`data-testid="app-nav"`).
3.  Nutze `.within(() => { ... })`, um alle nachfolgenden `cy`-Befehle nur innerhalb der Navigation auszuführen.
4.  Innerhalb von `within` kannst du nun kürzere Selektoren verwenden, z.B. `cy.get('[data-testid="nav-link-programs"]')`.

---

## Level 3: Testgetriebene Entwicklung (TDD-Style)

In diesem Level änderst du selbst den Anwendungs-Code. Schreibe zuerst einen Test, der fehlschlägt, nimm dann die Code-Änderung vor und sieh zu, wie der Test "grün" wird.

### Übung 8: Styling ändern & verifizieren

**Ziel:** Die Farbe des aktiven Navigationslinks ändern und per Test sicherstellen, dass die Änderung wirksam ist.

**Aufgaben:**

1.  **Test schreiben (der fehlschlägt):**
    - Erstelle einen Test, der zur "Programme"-Seite navigiert.
    - Selektiere den aktiven Link.
    - Füge eine Assertion hinzu, die prüft, ob der Link eine bestimmte Farbe hat, z.B. `rgb(255, 0, 0)` (rot). Nutze dafür `.should('have.css', 'color', 'rgb(255, 0, 0)')`.
    - **Erwartung:** Der Test schlägt fehl, da die Farbe noch nicht rot ist.

2.  **Code ändern:**
    - Finde die zuständige CSS-Regel in `client/src/styles/global.css` (vermutlich für `.app-nav-link--active`).
    - Ändere die `color` auf `red`.

3.  **Test erneut ausführen:**
    - Speichere die CSS-Datei. Cypress sollte den Test automatisch erneut ausführen.
    - **Erwartung:** Der Test ist jetzt erfolgreich.

### Übung 9: Text-Inhalt ändern & Test anpassen

**Ziel:** Einen Text in der Anwendung ändern und den zugehörigen Test anpassen.

**Aufgaben:**

1.  **Test schreiben (der fehlschlägt):**
    - Schreibe einen Test, der prüft, ob auf der Startseite ein Element mit dem Text "Willkommen im Förderportal" existiert.
    - **Erwartung:** Der Test schlägt fehl.

2.  **Code ändern:**
    - Öffne die `client/src/routes/Landing.tsx`.
    - Ändere die Überschrift oder füge einen neuen Text hinzu, sodass er "Willkommen im Förderportal" lautet.

3.  **Test erneut ausführen und "grün" sehen.**

### Übung 10: Anwendungs-Verhalten ändern & testen

**Ziel:** Den "Absenden"-Button im Login-Formular standardmäßig deaktivieren und nur aktivieren, wenn beide Felder ausgefüllt sind.

**Aufgaben:**

1.  **Test 1 schreiben (Button ist anfangs deaktiviert):**
    - Besuche die Login-Seite.
    - Überprüfe, ob der Submit-Button (`data-testid="login-submit"`) das `disabled`-Attribut hat.
    - **Tipp:** `.should('be.disabled')`.

2.  **Test 2 schreiben (Button wird aktiviert):**
    - Besuche die Login-Seite.
    - Gib Text in beide Felder ein (E-Mail und Passwort).
    - Überprüfe, ob der Button nun *nicht* mehr deaktiviert ist.
    - **Tipp:** `.should('not.be.disabled')`.
    - **Erwartung:** Beide Tests schlagen zunächst fehl.

3.  **Code ändern:**
    - Öffne die `client/src/routes/Login.tsx`.
    - Nutze Reacts `useState`, um den Zustand der Input-Felder zu speichern.
    - Füge dem Button das `disabled`-Attribut hinzu, basierend auf dem Zustand der Felder (z.B. `disabled={!email || !password}`).

4.  **Tests erneut ausführen und "grün" sehen.**

---

## Level 4: Fortgeschrittene Konzepte

### Übung 11: Eigene Cypress-Befehle (Custom Commands)

**Ziel:** Wiederkehrende Aktionen in einen eigenen Befehl auslagern, um Tests sauberer zu halten.

**Aufgaben:**

1.  Öffne die Datei `cypress/support/commands.ts`.
2.  Erstelle einen neuen Befehl `cy.login(email, password)`.
3.  Dieser Befehl soll die Schritte aus **Übung 6** kapseln: Login-Seite besuchen, E-Mail und Passwort eingeben und auf "Absenden" klicken.
4.  **Wichtig:** Füge die Typdefinition für deinen neuen Befehl in `cypress/support/index.ts` hinzu, damit TypeScript ihn erkennt.
5.  Schreibe einen neuen Test, der `cy.login('test@example.com', 'password123')` verwendet, um sich anzumelden.

### Übung 12: Mit dem Netzwerk interagieren (`cy.intercept`)

**Ziel:** API-Requests abfangen, um das Verhalten des Frontends unter bestimmten Netzwerkbedingungen zu testen (z.B. Ladezustände oder Fehler).

**Aufgaben:**

1.  **Test für Fehlerfall schreiben:**
    - Erstelle einen Test für die "Programme"-Seite.
    - Bevor du die Seite besuchst, fange den API-Request zu `/programs` mit `cy.intercept()` ab.
    - Konfiguriere den Intercept so, dass er einen 500er-Fehler zurückgibt: `cy.intercept('GET', '/api/v1/programs', { statusCode: 500, body: {} })`.
    - Besuche die "Programme"-Seite.
    - Überprüfe, ob eine Fehlermeldung für den Benutzer angezeigt wird (du musst eventuell eine im Code hinzufügen!).

2.  **Test für Ladezustand (Bonus):**
    - Fange den gleichen Request ab, aber füge ein `delay` hinzu: `cy.intercept('GET', '/api/v1/programs', { delay: 1000, fixture: 'programs.json' })`. (Du musst evtl. eine `programs.json` in `cypress/fixtures` anlegen).
    - Überprüfe, ob ein Lade-Spinner oder eine ähnliche UI angezeigt wird, während die Daten geladen werden.

### Übung 13: Test-Setup mit `beforeEach`

**Ziel:** Wiederkehrenden Setup-Code (wie das Besuchen einer Seite) in einem `beforeEach`-Hook zusammenfassen.

**Aufgaben:**

1.  Öffne deine `03-login-form.cy.ts`-Datei. Du wirst feststellen, dass jeder `it`-Block mit `cy.visit('/login')` beginnt.
2.  Füge einen `beforeEach`-Hook innerhalb deines `describe`-Blocks hinzu.
3.  Verschiebe den `cy.visit('/login')`-Befehl in den `beforeEach`-Hook.
4.  Entferne die `cy.visit`-Zeile aus allen `it`-Blöcken.
5.  Stelle sicher, dass die Tests immer noch erfolgreich durchlaufen.

### Übung 14: Aliase für Requests und Elemente

**Ziel:** `cy.intercept` und `cy.get` mit Aliasen versehen, um auf sie warten zu können oder sie wiederzuverwenden.

**Aufgaben:**

1.  **Request-Alias:**
    - Erstelle einen neuen Test für die "Programme"-Seite.
    - Intercepte den `GET /api/v1/programs`-Request und gib ihm einen Alias: `.as('getPrograms')`.
    - Besuche die Seite.
    - Warte explizit auf das Ende des Requests mit `cy.wait('@getPrograms')`.
    - Überprüfe den Status-Code der Antwort: `cy.wait('@getPrograms').its('response.statusCode').should('eq', 200)`.

2.  **Element-Alias:**
    - Selektiere in einem Test das Login-Formular: `cy.get('form').as('loginForm')`.
    - Greife später über den Alias darauf zu, um z.B. die Eingabefelder darin zu finden: `cy.get('@loginForm').find('[data-testid="login-email"]').type('test@user.com')`.

---

## Level 5: Komplette End-to-End-Szenarien

In diesem Level kombinierst du alle bisher gelernten Fähigkeiten, um vollständige Benutzer-Flows von Anfang bis Ende zu testen.

### Übung 15: "Happy Path" – Einen Antrag erstellen

**Ziel:** Den gesamten Prozess der Erstellung eines neuen Antrags testen.

**Aufgaben:**

1.  Erstelle eine neue Test-Datei `cypress/e2e/04-application-new.cy.ts`.
2.  **Schritt 1: Login.** Nutze deinen Custom Command `cy.login()`, um dich anzumelden.
3.  **Schritt 2: Navigation.** Navigiere zur "Antrag erstellen"-Seite (`/applications/new`).
4.  **Schritt 3: Formular ausfüllen.**
    - Wähle ein Programm aus dem Dropdown (`ProgramSelect`).
    - Gib einen Namen und eine E-Mail ein.
    - Gib einen Betrag ein.
    - Gib einen Verwendungszweck an.
    - Lade eine Datei hoch (Tipp: `cy.get('input[type="file"]').selectFile('cypress/fixtures/example.json')`). Du musst evtl. die `example.json` in `cypress/fixtures` anlegen.
5.  **Schritt 4: Absenden.** Klicke auf den "Absenden"-Button.
6.  **Schritt 5: Verifizierung.**
    - Überprüfe, ob du zur Detail-Seite des neuen Antrags weitergeleitet wirst (z.B. `cy.url().should('include', '/applications/')`).
    - Überprüfe, ob die soeben eingegebenen Daten auf der Detail-Seite korrekt angezeigt werden.

### Übung 16: Formular-Validierung testen

**Ziel:** Sicherstellen, dass das Antragsformular korrekte Fehlermeldungen anzeigt, wenn Felder leer gelassen werden.

**Aufgaben:**

1.  Schreibe einen neuen Test in `04-application-new.cy.ts`.
2.  Navigiere zur "Antrag erstellen"-Seite (nach dem Login).
3.  Klicke direkt auf den "Absenden"-Button, ohne Felder auszufüllen.
4.  Überprüfe, ob für jedes Pflichtfeld eine Fehlermeldung angezeigt wird.
    - Beispiel: `cy.get('[data-testid="applicant-name-field"]').should('contain.text', 'Name ist ein Pflichtfeld')`. (Du musst die Fehlermeldungen eventuell zuerst im Code implementieren!)
5.  **Bonus:** Fülle nur ein Feld aus und prüfe, ob die anderen Fehlermeldungen weiterhin sichtbar sind.

---

## Level 6: Fortgeschrittene Techniken & Konfiguration

### Übung 17: Viewport-Tests für responsives Design

**Ziel:** Testen, wie sich die Anwendung auf verschiedenen Bildschirmgrößen verhält.

**Aufgaben:**

1.  Erstelle eine neue Test-Datei `cypress/e2e/05-responsive.cy.ts`.
2.  Schreibe einen Test, der die Startseite auf Desktop-Größe prüft.
    - Nutze `cy.viewport('macbook-15')`.
    - Überprüfe, ob die Hauptnavigation (`[data-testid="app-nav"]`) sichtbar ist.
3.  Schreibe einen zweiten Test für eine mobile Ansicht.
    - Nutze `cy.viewport('iphone-6')`.
    - Überprüfe, ob die Hauptnavigation jetzt *nicht* mehr direkt sichtbar ist.
    - **TDD-Aufgabe:** Implementiere ein "Burger-Menü". Schreibe einen Test, der auf den Burger-Button klickt und dann prüft, ob die Navigation sichtbar wird. Ändere den App-Code, damit der Test besteht.

### Übung 18: `baseUrl` in der Konfiguration

**Ziel:** Die `baseUrl` in der Cypress-Konfigurationsdatei setzen, um `cy.visit()`-Aufrufe zu vereinfachen.

**Aufgaben:**

1.  Öffne die Datei `cypress.config.ts`.
2.  Füge die `baseUrl`-Eigenschaft im `e2e`-Block hinzu und setze sie auf die Adresse deiner lokalen Entwicklungsumgebung (z.B. `http://localhost:5173`).
3.  Gehe zurück zu deinen Tests (z.B. `01-smoke.cy.ts`) und ändere `cy.visit('http://localhost:5173/')` zu `cy.visit('/')`.
4.  Stelle sicher, dass die Tests weiterhin funktionieren.

### Übung 19: Testorganisation mit `.only` und `.skip`

**Ziel:** Lernen, wie man während der Entwicklung gezielt nur bestimmte Tests oder Test-Suiten ausführt.

**Aufgaben:**

1.  Öffne eine deiner Test-Dateien mit mehreren `it`-Blöcken.
2.  Hänge an einen `it`-Block ein `.only` an: `it.only('sollte nur dieser Test laufen', ...`.
3.  Führe Cypress aus und beobachte, wie nur dieser eine Test ausgeführt wird.
4.  Ändere das `.only` zu einem `.skip`: `it.skip('sollte übersprungen werden', ...`.
5.  Beobachte, wie dieser Test nun als "pending" markiert und übersprungen wird.
6.  **Wichtig:** Entferne die `.only`- und `.skip`-Anweisungen wieder, bevor du deine Arbeit committest!

### Übung 20 (Challenge): Dynamische Daten aus Fixtures

**Ziel:** Einen Test so refaktorieren, dass er Testdaten aus einer Fixture-Datei liest und über die Daten iteriert.

**Aufgaben:**

1.  Erstelle eine Fixture-Datei `cypress/fixtures/programs.json`, die ein Array von Programm-Objekten enthält (z.B. `[{ "id": 1, "name": "Programm 1" }, { "id": 2, "name": "Programm 2" }]`).
2.  Schreibe einen Test für die "Programme"-Seite.
3.  Nutze `cy.intercept`, um den Request an `/api/v1/programs` abzufangen und deine Fixture zurückzugeben: `cy.intercept('GET', '/api/v1/programs', { fixture: 'programs.json' }).as('getPrograms')`.
4.  Lade die Fixture-Daten zusätzlich im Test mit `cy.fixture('programs.json').then((programs) => { ... })`.
5.  Iteriere über die `programs` aus der Fixture (z.B. mit `forEach`) und überprüfe für jedes Programm, ob ein entsprechendes Element auf der Seite angezeigt wird.
    - Beispiel: `programs.forEach(program => { cy.contains(program.name).should('be.visible'); });`
