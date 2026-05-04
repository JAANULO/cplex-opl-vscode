<!-- Keep a Changelog guide -> https://keepachangelog.com -->

# CPLEX-Plugin Changelog (VS Code)

> **Zasada parzystości wersji:** Rozszerzenie dla VS Code jest w pełni zsynchronizowane numerycznie i funkcjonalnie z wtyczką dla środowisk JetBrains. Wydanie konkretnej wersji w VS Code (np. 1.4.2) oznacza osiągnięcie dokładnie tych samych funkcji, jakie są dostępne w bliźniaczej wersji JetBrains. Poniższa historia zmian jest wspólna dla obu platform.

## [Unreleased]

## [1.4.2] - 2026-05-02

### Changed
- **Compatibility:** Lowered minimum required IDE version to 2024.3 (build 243) to support older IDE installations.

### Fixed
- **Formatter:** Fixed indentation logic in `OplBlock` to correctly indent nested structures within constraint blocks.
- **Annotator:** Fixed false positive "Undefined variable" errors for multiple iterators in loops (e.g., `forall(i, j in ...)`).

## [1.4.1] - 2026-05-02

### Fixed
- **PyCharm Compatibility:** Added missing `com.intellij.modules.lang` dependency to `plugin.xml` to fix installation issues in PyCharm and other JetBrains IDEs.
- **File Icons:** Added `icon=` attributes to `fileType` definitions in `plugin.xml` to enforce rendering of dedicated SVG icons for `.mod` and `.dat` files.

## [1.4.0] - 2026-05-02

### Added

- **File Templates:** Added "New -> OPL File" action to generate `.mod` and `.dat` files from templates.
- **Execute Blocks:** Extended parser support for `execute` blocks and script-style tokens/operators.
- **CP Keywords:** Added lexer/parser support for `pulse`, `step`, `allDifferent`, and `pack`.
- **Iterators:** Added reusable iterators for `forall`/`sum`, including multiple iterators.
- **Operators:** Added lexer/parser support for `==`, `&&`, `||`, `!`, and `%`.
- **Array Literals:** Added grammar support for bracketed array literals in expressions.

### Fixed

- **Greedy Lexer Bug:** Fixed lexer rules for minus signs and variables (e.g., `r-1` without spaces) preventing false syntax errors.
- **Parser Completeness:** Added missing `==` (double equals) operator to the Lexer and Parser.
- **Formatter:** Added spacing for `==` and `!=`, plus improved indentation in constraint/execute blocks and nested loops.
- **Annotator:** Skip `execute` blocks and improve iterator scope checks to avoid false errors.

## [1.3.0] - 2026-04-13

### Added

- Initial support for IBM ILOG CPLEX OPL.
- Syntax highlighting for .mod and .dat files.
- Run configuration for oplrun solver with .dat file support.
- Auto-Detect mechanism for automatic oplrun executable path discovery (Zero-Config).
- Global settings state to persistently save the CPLEX path across configurations.
- XML-based Live Templates for quick OPL code generation (model skeleton, forall, sum, etc.).
- **Console Issue Navigation:** Clickable file links in execution console that map solver errors directly to specific lines in the code.
- **File Type Support:** Auto-pairing of `.mod` and `.dat` files with the same name during run configuration setup.
- **Code Completion:** Basic autocompletion for OPL keywords and operators via `CompletionContributor`.
- **Structure View:** Interactive side-panel tree view for navigating variables, objectives, and constraints.
- **Code Formatter:** Automatic code formatting (`Ctrl + Alt + L`) for correct indentation and spacing in constraints and loops.
- **Custom Icons:** Unique SVG icons to visually distinguish `.mod` and `.dat` files in the project tree.

### Fixed

- Qodana linting issues.
- Plugin description in README.md.
- **Annotator:** Removed an incorrect Java-style naming validation rule that flagged uppercase OPL variable names (like `NbItems`) as errors.
- Removed duplicated `configurationType` registration from `plugin.xml`.

### Changed

- Updated `README.md` feature lists (EN/PL) to match current implementation.
- Updated `do_zrobienia.md` with explicit `DONE` / `PARTIAL` / `TODO` status markers.

[Unreleased]: https://github.com/JAANULO/CPLEX-Plugin/compare/1.4.2...HEAD
[1.4.2]: https://github.com/JAANULO/CPLEX-Plugin/compare/1.4.1...1.4.2
[1.4.1]: https://github.com/JAANULO/CPLEX-Plugin/compare/1.4.0...1.4.1
[1.4.0]: https://github.com/JAANULO/CPLEX-Plugin/compare/1.3.0...1.4.0
[1.3.0]: https://github.com/JAANULO/CPLEX-Plugin/commits/1.3.0
[1.2.0]: https://github.com/JAANULO/CPLEX-Plugin/commits/1.2.0
