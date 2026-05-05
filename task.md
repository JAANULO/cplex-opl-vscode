# Roadmap v1.5: Engineering & Intelligence Update

## 1. Code Intelligence (Navigation)
- [x] **Find Usages:** Wdrożenie `ReferenceProvider` (`src/providers/references.ts`).
- [x] **Rename Refactoring:** Wdrożenie `RenameProvider` (`src/providers/rename.ts`).
- [x] **Hover Information:** Wdrożenie `HoverProvider` (`src/providers/hover.ts`).

## 2. Automatyzacja i UX
- [x] **Smart Run:** Aktualizacja `runModel.ts` o rozpoznawanie plików `.dat`.
- [x] **.dat Generator:** Stworzenie komendy generującej szkielet danych.
- [x] **Breadcrumbs:** Optymalizacja nazw symboli dla paska nawigacji.

## 3. Inteligentna Diagnostyka (Engineering)
- [x] **Linearity Auditor:** Wykrywanie niebezpiecznych nieliniowości (np. `x * y`).
- [x] **CP Auto-Switcher:** Quick-fix dodający `using CP;` przy wykryciu słów szeregowania.
