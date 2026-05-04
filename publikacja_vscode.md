# Publikacja wtyczki w VS Code Marketplace (CI/CD GitHub Actions)

Aby automatycznie wysyłać wtyczkę z GitHuba do VS Code Marketplace, musimy uwierzytelnić proces za pomocą Personal Access Token (PAT – osobisty klucz autoryzacyjny) z platformy Azure DevOps.

## 1. Generowanie tokenu dostępu (PAT)
Wtyczki VS Code są hostowane przez infrastrukturę Microsoftu.
1. Zaloguj się na portal [Azure DevOps](https://dev.azure.com/).
2. Utwórz nową organizację, jeśli jeszcze jej nie posiadasz.
3. W prawym górnym rogu kliknij ikonę ustawień użytkownika i wybierz **Personal Access Tokens**.
4. Kliknij **New Token** i wypełnij formularz:
   * **Name**: np. `VSCE_PUBLISH_PAT`
   * **Organization**: Wybierz `All accessible organizations`.
   * **Expiration**: Ustaw maksymalny czas (będziesz musiał go odnowić po wygaśnięciu).
   * **Scopes**: Wybierz `Custom defined`. Znajdź na liście pozycję **Marketplace** i zaznacz opcję **Manage**.
5. Kliknij *Create*, a następnie **skopiuj wygenerowany token**. Nie będzie on widoczny ponownie.



## 2. Rejestracja wydawcy (Publisher)
Musisz posiadać identyfikator wydawcy, do którego zostanie przypisana wtyczka.
1. Przejdź do panelu zarządzania [VS Code Marketplace Management](https://marketplace.visualstudio.com/manage).
2. Zaloguj się tym samym kontem Microsoft i kliknij **Create publisher**. 
3. Wymyśl i zapisz swój identyfikator (np. `janusz-andrzejewski`).

## 3. Konfiguracja pliku `package.json`
Główny plik konfiguracyjny rozszerzenia VS Code musi zawierać powiązanie z utworzonym wydawcą oraz repozytorium. Zaktualizuj poniższe klucze:
```json
{
  "name": "opl-support",
  "displayName": "CPLEX OPL",
  "publisher": "TWÓJ_PUBLISHER_ID",
  "version": "1.0.0",
  "repository": {
    "type": "git",
    "url": "[https://github.com/JAANULO/CPLEX-Plugin](https://github.com/JAANULO/CPLEX-Plugin)"
  }
}
```

## 4. Dodanie tokenu do GitHub Secrets
Musimy bezpiecznie przekazać token do GitHub Actions.
1. W repozytorium GitHub przejdź do **Settings** -> **Secrets and variables** -> **Actions**.
2. Kliknij **New repository secret**.
3. **Name**: Wpisz `VSCE_PAT`.
4. **Secret**: Wklej skopiowany wcześniej token z Azure DevOps. Zapisz.

## 5. Utworzenie skryptu GitHub Actions
Utwórz plik w ścieżce `.github/workflows/vscode-publish.yml`. Ten skrypt wykorzystuje oficjalne narzędzie CLI Microsoftu (`@vscode/vsce`) do budowania i wysyłania paczki `.vsix`.
```yaml
name: Publish VS Code Extension

on:
  release:
    types: [published] # Uruchamia się po opublikowaniu Release'u na GitHubie

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - name: Pobranie kodu repozytorium
        uses: actions/checkout@v4

      - name: Konfiguracja środowiska Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Instalacja zależności
        run: npm install

      - name: Budowanie i publikacja w Marketplace
        run: npx @vscode/vsce publish
        env:
          VSCE_PAT: ${{ secrets.VSCE_PAT }}
```

## 6. Standardowa procedura wydawnicza
Kiedy wprowadzisz zmiany w kodzie wtyczki i będziesz gotowy na nową wersję:
1. Zaktualizuj numer wersji w `package.json`.
2. Zrób standardowy `git commit` i `git push`.
3. Utwórz nowy **Release** na platformie GitHub i kliknij "Publish release".
4. GitHub Actions automatycznie pobierze kod, zbuduje paczkę i wyśle ją do VS Code Marketplace.
