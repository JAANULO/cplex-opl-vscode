# CPLEX-Plugin dla VS Code

Profesjonalne rozszerzenie do obsługi języka IBM ILOG CPLEX OPL w środowisku Visual Studio Code.
Zapewnia kolorowanie składni, inteligentne podpowiedzi oraz integrację z silnikiem solvera. Wersja ta jest synchronizowana funkcjonalnie z bliźniaczą wtyczką dla środowisk JetBrains.

[🇬🇧 English](#english) | [🇵🇱 Polski](#polski)

<p>Provides native support for IBM ILOG CPLEX Optimization Programming Language (OPL) in Visual Studio Code.</p>
<ul>
  <li>Syntax highlighting and code completion for OPL</li>
  <li>Task execution for local oplrun solver with .mod/.dat auto-pairing</li>
  <li>Interactive structure view and problem navigation</li>
</ul>
---

<h2 id="english">🇬🇧 English</h2>

Extension adding native support for IBM ILOG CPLEX Optimization Programming Language (OPL) in Visual Studio Code.

### Features (Aiming for JetBrains Parity)
* **Syntax Highlighting:** Keyword, model structure, and operator highlighting for `.mod` files using TextMate grammars.
* **Code Completion:** Basic keyword and built-in function completion (via Language Server/Snippets).
* **Run Integration:** Direct execution of `oplrun` via VS Code Tasks and Command Palette.
* **Auto-Pairing:** Automatic `.dat` pairing when a matching file name exists.
* **Path Support:** Auto-detection of CPLEX Studio install paths.
* **Structure View:** Outline panel listing declarations, objective, and constraints.
* **Editor Utilities:** Snippets, commenter (`Ctrl+/`), brace matcher, and code formatting.

### Requirements
A local installation of **IBM ILOG CPLEX Studio** is required for task execution. You can configure the `oplrun` path in VS Code settings or use auto-detect from common install paths.

---

<h2 id="polski">🇵🇱 Polski</h2>

Rozszerzenie dodające natywne wsparcie dla języka IBM ILOG CPLEX Optimization Programming Language (OPL) w środowisku Visual Studio Code.

### Funkcje (Docelowo zgodne z wersją JetBrains)
* **Kolorowanie składni:** Podświetlanie słów kluczowych, struktury modelu oraz operatorów dla plików `.mod` (TextMate).
* **Code Completion:** Autouzupełnianie słów kluczowych i funkcji wbudowanych (Snippety/LSP).
* **Integracja uruchamiania:** Wywoływanie lokalnego `oplrun` bezpośrednio z edytora poprzez VS Code Tasks.
* **Auto-parowanie plików:** Automatyczne podpinanie `.dat`, gdy istnieje plik o tej samej nazwie.
* **Obsługa ścieżki:** Auto-detekcja CPLEX Studio lub ręczna konfiguracja w `settings.json`.
* **Structure View:** Widok hierarchii modelu (Outline) pokazujący deklaracje, cel i ograniczenia.
* **Narzędzia edytora:** Snippety, komentowanie (`Ctrl+/`), pary nawiasów i formatowanie kodu.

### Wymagania
Do poprawnego działania uruchamiania modeli wymagana jest lokalna instalacja **IBM ILOG CPLEX Studio**. Ścieżkę do `oplrun` (lub `oplrun.exe` na Windows) można skonfigurować ręcznie w ustawieniach VS Code albo pozwolić na automatyczne wykrycie domyślnych lokalizacji.
