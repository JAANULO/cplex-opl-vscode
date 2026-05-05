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

### Features (v1.5 Engineering Edition)
* **Syntax Highlighting:** Enhanced keyword, CP, and script operator highlighting for `.mod` files.
* **Diagnostics (Annotator):** Real-time error detection for undefined variables, duplicate identifiers, missing semicolons, and scope-aware OPLScript validation.
* **Engineering Auditor:** Advanced diagnostics for linearity (MIP) and CP engine directives.
* **Code Intelligence:** Full support for **Go to Declaration**, **Find Usages**, and **Rename Refactoring**.
* **Hover Info:** Instant variable type and definition preview on mouse hover.
* **Data Generator:** Automated `.dat` skeleton generation based on model parameters.
* **Smart Run:** One-click execution with automatic model/data pairing, even from `.dat` files.
* **File Icons:** Dedicated SVG icons for `.mod` and `.dat` files for professional file tree look.
* **Structure View:** Outline panel listing declarations, objective, and constraints.
* **Editor Utilities:** Snippets, commenter (`Ctrl+/`), brace matcher, and code formatting.

### Requirements
A local installation of **IBM ILOG CPLEX Studio** is required for task execution. You can configure the `oplrun` path in VS Code settings or use auto-detect from common install paths.

---

<h2 id="polski">🇵🇱 Polski</h2>

Rozszerzenie dodające natywne wsparcie dla języka IBM ILOG CPLEX Optimization Programming Language (OPL) w środowisku Visual Studio Code.

### Funkcje (v1.5 Engineering Edition)
* **Kolorowanie składni:** Rozszerzone podświetlanie słów kluczowych, CP oraz operatorów skryptowych.
* **Diagnostyka (Annotator):** Wykrywanie błędów w locie (niezdefiniowane zmienne, duplikaty, brakujące średniki, inteligentna walidacja OPLScript).
* **Audytor Inżynierski:** Zaawansowana analiza nieliniowości (MIP) oraz dyrektyw silnika CP.
* **Inteligencja Kodu:** Pełne wsparcie dla **Find Usages**, **Rename Refactoring** oraz **Go to Declaration**.
* **Hover Info:** Natychmiastowy podgląd typu i definicji zmiennej po najechaniu myszką.
* **Generator Danych:** Automatyczne tworzenie szkieletu pliku `.dat` na podstawie parametrów modelu.
* **Smart Run:** Uruchamianie jednym kliknięciem z automatycznym parowaniem model/dane, również z poziomu plików `.dat`.
* **Ikony plików:** Dedykowane ikony SVG dla plików `.mod` i `.dat`.
* **Structure View:** Interaktywny panel Outline pokazujący hierarchię modelu.
* **Narzędzia edytora:** Snippety, komentowanie (`Ctrl+/`), pary nawiasów i formatowanie kodu.

### Wymagania
Do poprawnego działania uruchamiania modeli wymagana jest lokalna instalacja **IBM ILOG CPLEX Studio**. Ścieżkę do `oplrun` (lub `oplrun.exe` na Windows) można skonfigurować ręcznie w ustawieniach VS Code albo pozwolić na automatyczne wykrycie domyślnych lokalizacji.
