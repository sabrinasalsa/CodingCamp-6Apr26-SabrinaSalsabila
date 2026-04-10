# Implementation Plan: Dashboard Enhancements

## Overview

Extend the existing personal dashboard (`index.html`, `css/style.css`, `js/app.js`) with three additive enhancements: a light/dark theme toggle, a custom name in the greeting, and a configurable Pomodoro duration. No new files are introduced; all changes land in the three existing files.

## Tasks

- [x] 1. Add CSS custom properties and dark-theme overrides to `css/style.css`
  - Replace all hard-coded color literals with CSS custom properties on `:root` (`--bg-page`, `--bg-widget`, `--text-main`, `--text-muted`, `--border`)
  - Add `[data-theme="dark"]` block overriding those properties with dark-palette values
  - Add styles for `#btn-theme-toggle` in the page header and the `.dashboard-header` layout
  - Add styles for `#name-input`, `#btn-save-name`, `#duration-input`, `#btn-set-duration`, and `.duration-input-row`
  - _Requirements: 1.3, 1.4_

- [x] 2. Add theme toggle and name/duration controls to `index.html`
  - Add a `<header class="dashboard-header">` above `.dashboard-grid` containing `<button id="btn-theme-toggle">`
  - Add `#name-input` and `#btn-save-name` inside `#widget-greeting` below the existing time/date elements
  - Add `#duration-input`, `#btn-set-duration`, and `<p id="duration-error" class="error-msg" hidden>` inside `#widget-timer` below `.timer-controls`
  - _Requirements: 1.1, 2.1, 3.1_

- [x] 3. Extend the Storage module in `js/app.js`
  - Add `Storage.getTheme()` / `Storage.saveTheme(theme)` using key `pd_theme`, defaulting to `'light'`
  - Add `Storage.getName()` / `Storage.saveName(name)` using key `pd_name`; `saveName` removes the key when given an empty string
  - Add `Storage.getDuration()` / `Storage.saveDuration(mins)` using key `pd_duration`, defaulting to `25`
  - Wrap all new calls in the existing `try/catch` pattern
  - _Requirements: 1.5, 1.6, 2.3, 2.4, 3.6, 3.7_

  - [ ]* 3.1 Write property test for theme persistence round-trip (Property 2)
    - **Property 2: Theme persistence round-trip**
    - **Validates: Requirements 1.5, 1.6**
    - File: `tests/theme.test.js`

  - [ ]* 3.2 Write property test for name persistence round-trip (Property 6)
    - **Property 6: Name persistence round-trip**
    - **Validates: Requirements 2.3, 2.4**
    - File: `tests/greeting.test.js`

  - [ ]* 3.3 Write property test for duration persistence round-trip (Property 10)
    - **Property 10: Duration persistence round-trip**
    - **Validates: Requirements 3.6, 3.7**
    - File: `tests/timer.test.js`

- [x] 4. Implement theme toggle logic in `js/app.js`
  - Add `let currentTheme = 'light'` state variable
  - Write `applyTheme(theme)` — sets `data-theme` attribute on `<html>`, updates `#btn-theme-toggle` text content to reflect active theme
  - Write `toggleTheme()` — flips `currentTheme`, calls `applyTheme`, persists via `Storage.saveTheme`
  - In the `DOMContentLoaded` handler, load theme from Storage and call `applyTheme` before any render; wire `#btn-theme-toggle` click to `toggleTheme`
  - _Requirements: 1.1, 1.2, 1.5, 1.6, 1.7, 1.8_

  - [ ]* 4.1 Write property test for theme toggle round-trip (Property 1)
    - **Property 1: Theme toggle is a round-trip**
    - **Validates: Requirements 1.2**
    - File: `tests/theme.test.js`

  - [ ]* 4.2 Write property test for toggle label reflecting active theme (Property 3)
    - **Property 3: Theme toggle label reflects active theme**
    - **Validates: Requirements 1.8**
    - File: `tests/theme.test.js`

  - [ ]* 4.3 Write unit test: default theme is light when localStorage is empty
    - **Validates: Requirements 1.7**
    - File: `tests/theme.test.js`

- [x] 5. Checkpoint — verify theme toggle works end-to-end in the browser
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Implement custom name in greeting in `js/app.js`
  - Add `let userName = ''` state variable
  - Write `buildGreeting(hour, name)` — pure function returning `"[phrase], [name]"` when name is non-empty, or `"[phrase]"` when name is empty
  - Write `saveName(name)` — trims input, updates `userName`, persists via `Storage.saveName`, calls `renderGreeting`
  - Write `renderGreeting()` — reads `userName` and current `Date`, updates `#greeting-text` using `buildGreeting`
  - Update the existing `updateGreeting()` to call `buildGreeting` with `userName` instead of `getGreeting` alone
  - In the `DOMContentLoaded` handler, load name from Storage into `userName`; wire `#btn-save-name` click and `#name-input` Enter key to `saveName`
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7_

  - [ ]* 6.1 Write property test for greeting format with name (Property 4)
    - **Property 4: Greeting with name matches expected format**
    - **Validates: Requirements 2.2, 2.7**
    - File: `tests/greeting.test.js`

  - [ ]* 6.2 Write property test for whitespace-only name clearing (Property 5)
    - **Property 5: Whitespace-only name is cleared**
    - **Validates: Requirements 2.6**
    - File: `tests/greeting.test.js`

  - [ ]* 6.3 Write unit test: greeting without name shows phrase only
    - **Validates: Requirements 2.5**
    - File: `tests/greeting.test.js`

- [x] 7. Implement configurable Pomodoro duration in `js/app.js`
  - Add `let configuredDuration = 1500` state variable
  - Write `validateDuration(value)` — pure function returning `{ok: true, minutes: n}` for valid integers in [1, 180], or `{ok: false, error: string}` otherwise
  - Write `setDuration(minutes)` — updates `configuredDuration` to `minutes * 60`, calls `timerReset`, persists via `Storage.saveDuration`
  - Update `timerReset()` to use `configuredDuration` instead of the hard-coded `1500`
  - Update `renderTimer()` to disable `#duration-input` and `#btn-set-duration` when `timerState.running === true`
  - In the `DOMContentLoaded` handler, load duration from Storage and call `setDuration`; wire `#btn-set-duration` click to validate and call `setDuration`, showing/hiding `#duration-error`
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9_

  - [ ]* 7.1 Write property test for valid duration setting timer seconds (Property 7)
    - **Property 7: Valid duration sets timer to correct seconds**
    - **Validates: Requirements 3.2**
    - File: `tests/timer.test.js`

  - [ ]* 7.2 Write property test for reset restoring configured duration (Property 8)
    - **Property 8: Reset restores configured duration**
    - **Validates: Requirements 3.3**
    - File: `tests/timer.test.js`

  - [ ]* 7.3 Write property test for invalid duration rejection (Property 9)
    - **Property 9: Invalid duration is rejected**
    - **Validates: Requirements 3.4, 3.5**
    - File: `tests/timer.test.js`

  - [ ]* 7.4 Write property test for duration input disabled while running (Property 11)
    - **Property 11: Duration input disabled while running**
    - **Validates: Requirements 3.9**
    - File: `tests/timer.test.js`

  - [ ]* 7.5 Write unit test: default duration is 1500 s when localStorage is empty
    - **Validates: Requirements 3.8**
    - File: `tests/timer.test.js`

- [-] 8. Final checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Each task references specific requirements for traceability
- Property tests use **fast-check** (`npm install --save-dev fast-check`) and run a minimum of 100 iterations each
- All property tests must include the comment `// Feature: dashboard-enhancements, Property N: <property text>`
- The Storage module must wrap all `localStorage` calls in `try/catch` and continue gracefully on failure
