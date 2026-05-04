# do_zrobienia.md — Strategia rozwoju wtyczki CPLEX OPL dla VS Code

Celem projektu jest stworzenie środowiska do pracy z językiem OPL w Visual Studio Code, eliminując konieczność używania CPLEX Studio.

> **Zasada parzystości:** Docelowo rozszerzenie w VS Code musi posiadać **dokładnie taką samą funkcjonalność** i wersjonowanie (obecnie dążymy do 1.4.2) jak odpowiednik dla JetBrains. W związku z tym obecny status większości funkcji to `TODO` (wymagają przeniesienia z JetBrains na mechanizmy VS Code).

## Legenda statusów
- `DONE` — funkcja zaimplementowana w VS Code
- `PARTIAL` — funkcja przeniesiona/wdrożona częściowo
- `TODO` — funkcja obecna w JetBrains (lub nowa), oczekująca na wdrożenie w VS Code

---

## ⏳ Do wdrożenia (Parzystość z JetBrains)

Poniższa lista odzwierciedla funkcje wdrożone już w wersji JetBrains (stan na wersję 1.4.2), które musimy zaimplementować tutaj.

### Szablony i podstawa
- `DONE` **Szablony plików:** Snippety `model`, `rng`, `dv`, `st`, `fa`, `sm`, `tup`, `exec` (`snippets/opl.code-snippets`).
- `DONE` Rejestracja języka OPL (pliki `.mod` i `.dat`).
- `DONE` Syntax Highlighting (kolorowanie składni — gramatyka TextMate `syntaxes/opl.tmLanguage.json`).
- `TODO` Ikony dla plików `.mod` i `.dat` (deklaracje iconTheme w `package.json`).

### Code Intelligence (LSP / Providers)
- `DONE` Code Completion — słowa kluczowe i funkcje wbudowane (`src/providers/completion.ts`).
- `DONE` Obsługa skrótu `Ctrl+/` (komentowanie) — `language-configuration.json`.
- `DONE` Podświetlanie par nawiasów `{}`, `()`, `[]` — `language-configuration.json`.
- `DONE` **Formatter:** Formatowanie kodu OPL — `Shift+Alt+F` (`src/providers/formatter.ts`).
- `DONE` **Structure View:** Widok drzewa modelu (Outline) (`src/providers/symbol.ts`).
- `TODO` **Contextual Autocomplete:** Semantyczne podpowiadanie zmiennych z aktualnego pliku.
- `TODO` **Annotator:** Walidacja błędów w locie (Diagnostyki LSP).

### Execution Engine (Krytyczne — MVP)
Warstwa odpowiedzialna za uruchamianie modeli i integrację z solverem CPLEX (`oplrun`).
- `DONE` Uruchamianie modeli OPL z poziomu IDE — przycisk Play i Command Palette (`src/commands/runModel.ts`).
- `DONE` **File Type Support:** Automatyczne łączenie par plików `.mod` i `.dat` przy uruchamianiu.
- `DONE` Integracja z terminalem VS Code (Output w oknie terminala).
- `DONE` **Integracja środowiska CPLEX:** Heurystyka ścieżek + ustawienie `cplex-opl.oplrunPath` w `settings.json`.

---

## Poziom Oczekujący (Funkcje planowane po wyrównaniu obu wtyczek)

Poniższe funkcje to cele długoterminowe, które będą tworzone równolegle w obu środowiskach.

### 4. Zaawansowana Analiza Systemowa (Trudne)
- `TODO` Inspekcja nieliniowości: `min`, `max`, `abs` (ostrzeganie o niejawnej linearyzacji).
- `TODO` Walidacja funkcji celu dla szeregowania (weryfikacja `endOf()` itp.).
- `TODO` Find Usages / Go to Declaration.

### 5. Architektura Referencji (Bardzo trudne)
- `TODO` **Language Server Protocol (LSP):** Uruchomienie pełnoprawnego serwera z dzieloną bazą kodową dla VS Code i JetBrains.

---

## ⭐ Priorytety dla VS Code
1. **Podstawowa rejestracja i Syntax Highlighting** (TextMate) — niezbędne minimum wizualne.
2. **Snippety i Language Configuration** (komentarze, nawiasy).
3. **Run Configuration** (`oplrun`) — wywołanie zewnętrznego procesu w panelu Output.
4. **Rozszerzenie funkcji API** — Formatter, Structure View.