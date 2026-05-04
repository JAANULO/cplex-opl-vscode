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
- `TODO` **Szablony plików:** Snippety (np. akcja tworzenia modelu/danych).
- `DONE` Rejestracja języka OPL (pliki `.mod` i `.dat`). *(zrealizowane w package.json scaffolding)*
- `TODO` Syntax Highlighting (kolorowanie składni oparte na gramatyce TextMate `.tmLanguage.json`).
- `TODO` Ikony dla plików `.mod` i `.dat` (deklaracje iconTheme w `package.json`).

### Code Intelligence (LSP / Providers)
- `TODO` Code Completion (autouzupełnianie słów kluczowych przez `CompletionItemProvider`).
- `TODO` Obsługa skrótu `Ctrl+/` (komentowanie) — definicja `language-configuration.json`.
- `TODO` Podświetlanie par nawiasów `{}`, `()`, `[]` (`language-configuration.json`).
- `TODO` Snippety z JetBrains (skróty: `model`, `rng`, `dv`, `st`, `fa`, `sm`, `tup`, `exec`) — przeniesienie jako JSON.
- `TODO` **Formatter:** Formatowanie kodu OPL (`DocumentFormattingEditProvider`).
- `TODO` **Structure View:** Interaktywne drzewo nawigacji (`DocumentSymbolProvider`).
- `TODO` **Contextual Autocomplete:** Semantyczne podpowiadanie zmiennych.
- `TODO` **Annotator:** Walidacja błędów w locie (Diagnostyki LSP).

### Execution Engine (Krytyczne — MVP)
Warstwa odpowiedzialna za uruchamianie modeli i integrację z solverem CPLEX (`oplrun`).
- `TODO` Uruchamianie modeli OPL z poziomu IDE (VS Code Tasks lub polecenie w Command Palette).
- `TODO` **File Type Support:** Automatyczne łączenie par plików `.mod` i `.dat` przy uruchamianiu.
- `TODO` Integracja z konsolą (Output Channel w VS Code).
- `TODO` **Integracja środowiska CPLEX:** Automatyczne wykrywanie instalacji (heurystyka ścieżek) i ustawienia w `settings.json`.

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