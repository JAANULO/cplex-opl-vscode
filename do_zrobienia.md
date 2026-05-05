# do_zrobienia.md — Strategia rozwoju wtyczki CPLEX OPL dla VS Code

Celem projektu jest stworzenie środowiska do pracy z językiem OPL w Visual Studio Code, eliminując konieczność używania CPLEX Studio.

> **Zasada parzystości:** Rozszerzenie w VS Code jest synchronizowane funkcjonalnie z wersją JetBrains. Obecna wersja 1.5.0 wprowadza zaawansowane funkcje inżynierskie (Linearity Auditor, .dat Generator), które wyznaczają nowy standard dla obu platform.

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
- `DONE` Syntax Highlighting (kolorowanie składni — wsparcie dla CP, OPLScript i operatorów).
- `DONE` Ikony dla plików `.mod` i `.dat` (File Icon Theme w `package.json`).

### Code Intelligence (LSP / Providers)
- `DONE` Code Completion — słowa kluczowe i funkcje wbudowane (`src/providers/completion.ts`).
- `DONE` Obsługa skrótu `Ctrl+/` (komentowanie) — `language-configuration.json`.
- `DONE` Podświetlanie par nawiasów `{}`, `()`, `[]` — `language-configuration.json`.
- `DONE` **Formatter:** Formatowanie kodu OPL — `Shift+Alt+F` (`src/providers/formatter.ts`).
- `DONE` **Structure View:** Widok drzewa modelu (Outline) (`src/providers/symbol.ts`).
- `DONE` **Contextual Autocomplete:** Semantyczne podpowiadanie zmiennych z aktualnego pliku.
- `DONE` **Annotator:** Zaawansowana walidacja błędów (duplikaty, średniki, bloki, niezdefiniowane zmienne, OPLScript, nieliniowość).

### Execution Engine (Krytyczne — MVP)
Warstwa odpowiedzialna za uruchamianie modeli i integrację z solverem CPLEX (`oplrun`).
- `DONE` **Smart Run:** Uruchamianie modeli z poziomu .mod/.dat z automatycznym parowaniem.
- `DONE` **File Type Support:** Automatyczne łączenie par plików `.mod` i `.dat` przy uruchamianiu.
- `DONE` Integracja z terminalem VS Code (Output w oknie terminala).
- `DONE` **Integracja środowiska CPLEX:** Heurystyka ścieżek + ustawienie `cplex-opl.oplrunPath` w `settings.json`.

---

## Poziom Oczekujący (Funkcje planowane po wyrównaniu obu wtyczek)

Poniższe funkcje to cele długoterminowe, które będą tworzone równolegle w obu środowiskach.

### 4. Zaawansowana Analiza Systemowa (Trudne)
- `DONE` **Linearity Auditor:** Ostrzeganie o nieliniowościach (mnożenie zmiennych decyzyjnych).
- `TODO` Walidacja funkcji celu dla szeregowania (weryfikacja `endOf()` itp.).
- `DONE` **Go to Declaration:** Globalna nawigacja z uwzględnieniem zasięgu (Scope).
- `DONE` **Find Usages:** Wyszukiwanie wszystkich użyć zmiennej.
- `DONE` **Rename Refactoring:** Bezpieczna zmiana nazw identyfikatorów.
- `DONE` **Hover Info:** Podgląd typu i definicji zmiennej.

### 5. Automatyzacja (v1.5)
- `DONE` **.dat Skeleton Generator:** Automatyczne tworzenie plików danych na podstawie modelu.

### 6. Architektura Referencji (Bardzo trudne)
- `TODO` **Language Server Protocol (LSP):** Uruchomienie pełnoprawnego serwera z dzieloną bazą kodową dla VS Code i JetBrains.

---

## ⭐ Priorytety dla VS Code
1. **Podstawowa rejestracja i Syntax Highlighting** (TextMate) — niezbędne minimum wizualne.
2. **Snippety i Language Configuration** (komentarze, nawiasy).
3. **Run Configuration** (`oplrun`) — wywołanie zewnętrznego procesu w panelu Output.
4. **Rozszerzenie funkcji API** — Formatter, Structure View.