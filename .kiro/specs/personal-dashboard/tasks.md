# Implementation Plan: Personal Dashboard

## Overview

Build a self-contained single-page dashboard using vanilla HTML, CSS, and JavaScript. The implementation follows the MVC-like structure defined in the design: state objects, render functions, event handlers, and a Storage module — all wired together in `js/app.js`.

## Tasks

- [x] 1. Scaffold project files and HTML structure
  - Create `index.html` with the four widget containers and all required DOM IDs: `#greeting-text`, `#time-display`, `#date-display`, `#timer-display`, `#btn-start`, `#btn-stop`, `#btn-reset`, `#task-input`, `#btn-add-task`, `#task-error`, `#task-list`, `#link-label-input`, `#link-url-input`, `#btn-add-link`, `#link-error`, `#links-list`
  - Create empty `css/style.css` and `js/app.js` files linked from `index.html`
  - _Requirements: 5.1, 5.2, 5.3_

- [ ] 2. Implement responsive CSS layout
  - [x] 2.1 Write base styles and multi-column grid layout for the four widgets
    - Default layout is multi-column grid (≥768px)
    - Add `@media (max-width: 767px)` rule switching to single-column stacked layout
    - Style widget cards, inputs, buttons, and task/link list items
    - _Requirements: 5.2, 5.4, 5.5_

- [ ] 3. Implement Greeting Widget
  - [x] 3.1 Write `formatTime(date)` — returns zero-padded `HH:MM` string
    - _Requirements: 1.1_
  - [ ]* 3.2 Write property test for `formatTime` (Property 1)
    - **Property 1: Time formatting is always valid HH:MM**
    - **Validates: Requirements 1.1**
    - File: `tests/greeting.test.js`
  - [x] 3.3 Write `formatDate(date)` — returns human-readable date via `Intl.DateTimeFormat`
    - _Requirements: 1.2_
  - [ ]* 3.4 Write property test for `formatDate` (Property 2)
    - **Property 2: Date formatting always contains required components**
    - **Validates: Requirements 1.2**
    - File: `tests/greeting.test.js`
  - [x] 3.5 Write `getGreeting(hour)` — returns correct message for each hour bucket
    - _Requirements: 1.3, 1.4, 1.5, 1.6_
  - [ ]* 3.6 Write property test for `getGreeting` (Property 3)
    - **Property 3: Greeting matches the correct hour bucket**
    - **Validates: Requirements 1.3, 1.4, 1.5, 1.6**
    - File: `tests/greeting.test.js`
  - [x] 3.7 Wire `setInterval` (1 s) to update `#greeting-text`, `#time-display`, `#date-display` on every tick
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6_

- [x] 4. Implement Focus Timer logic
  - [x] 4.1 Define `timerState` object `{remaining: 1500, running: false, complete: false}` and `formatTimer(seconds)` returning `MM:SS`
    - _Requirements: 2.1, 2.6_
  - [ ]* 4.2 Write property test for `formatTimer` (Property 7)
    - **Property 7: Timer display is always valid MM:SS**
    - **Validates: Requirements 2.6**
    - File: `tests/timer.test.js`
  - [x] 4.3 Write `timerTick()` — decrements `remaining`, sets `complete=true` and stops when reaching 0
    - _Requirements: 2.2, 2.5_
  - [ ]* 4.4 Write property test for `timerTick` (Property 4)
    - **Property 4: Timer tick decrements remaining by one**
    - **Validates: Requirements 2.2, 2.5**
    - File: `tests/timer.test.js`
  - [x] 4.5 Write `timerStop()` — pauses countdown, preserves `remaining`
    - _Requirements: 2.3_
  - [ ]* 4.6 Write property test for `timerStop` (Property 5)
    - **Property 5: Timer stop preserves remaining**
    - **Validates: Requirements 2.3**
    - File: `tests/timer.test.js`
  - [x] 4.7 Write `timerReset()` — restores `{remaining: 1500, running: false, complete: false}`
    - _Requirements: 2.4_
  - [ ]* 4.8 Write property test for `timerReset` (Property 6)
    - **Property 6: Timer reset always produces the initial state**
    - **Validates: Requirements 2.4**
    - File: `tests/timer.test.js`
  - [x] 4.9 Write `renderTimer()` — updates `#timer-display`, enables/disables `#btn-start` and `#btn-stop`, applies `.timer-complete` class
    - _Requirements: 2.6, 2.7, 2.8_
  - [ ]* 4.10 Write property test for button state derivation (Property 8)
    - **Property 8: Button states match running flag**
    - **Validates: Requirements 2.7, 2.8**
    - File: `tests/timer.test.js`
  - [ ]* 4.11 Write unit test: timer initializes to 1500 seconds
    - **Validates: Requirements 2.1**
    - File: `tests/timer.test.js`
  - [x] 4.12 Wire `#btn-start`, `#btn-stop`, `#btn-reset` click handlers to timer functions and `renderTimer()`
    - _Requirements: 2.2, 2.3, 2.4_

- [x] 5. Checkpoint — verify greeting and timer render correctly in the browser
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Implement Storage module
  - [x] 6.1 Write `Storage.getTasks()`, `Storage.saveTasks(tasks)`, `Storage.getLinks()`, `Storage.saveLinks(links)` using keys `pd_tasks` / `pd_links`
    - Wrap all calls in `try/catch`; log warnings on failure; return `[]` on read error
    - _Requirements: 3.8, 3.9, 4.5, 4.6_
  - [ ]* 6.2 Write property test for Storage round-trip (Property 14)
    - **Property 14: Storage round-trip preserves task and link lists**
    - **Validates: Requirements 3.8, 3.9, 4.5, 4.6**
    - File: `tests/storage.test.js`

- [x] 7. Implement To-Do List logic
  - [x] 7.1 Define `tasks` state array and write `addTask(label)` — trims input, rejects empty/whitespace, appends `{id, label, completed: false}`
    - _Requirements: 3.1, 3.2_
  - [ ]* 7.2 Write property test for `addTask` with valid input (Property 9)
    - **Property 9: Adding a valid task grows the list**
    - **Validates: Requirements 3.1**
    - File: `tests/todo.test.js`
  - [ ]* 7.3 Write property test for `addTask`/`editTask` with whitespace input (Property 10)
    - **Property 10: Whitespace-only input is always rejected**
    - **Validates: Requirements 3.2, 3.5**
    - File: `tests/todo.test.js`
  - [x] 7.4 Write `editTask(id, newLabel)` — trims and validates label, updates only the matching task's label
    - _Requirements: 3.4, 3.5_
  - [ ]* 7.5 Write property test for `editTask` (Property 11)
    - **Property 11: Editing a task updates only its label**
    - **Validates: Requirements 3.4**
    - File: `tests/todo.test.js`
  - [x] 7.6 Write `toggleTask(id)` — flips `completed` on the matching task
    - _Requirements: 3.6_
  - [ ]* 7.7 Write property test for `toggleTask` (Property 12)
    - **Property 12: Toggling completion twice restores original state**
    - **Validates: Requirements 3.6**
    - File: `tests/todo.test.js`
  - [x] 7.8 Write `deleteTask(id)` — removes the matching task from the array
    - _Requirements: 3.7_
  - [ ]* 7.9 Write property test for `deleteTask` (Property 13)
    - **Property 13: Deleting a task removes it from the list**
    - **Validates: Requirements 3.7**
    - File: `tests/todo.test.js`
  - [x] 7.10 Write `renderTasks()` — clears and rebuilds `#task-list`; each item renders checkbox, label/edit-input, edit button, delete button; applies visual distinction for completed tasks
    - _Requirements: 3.1, 3.3, 3.6_
  - [ ]* 7.11 Write unit test: edit control shows input field with current label
    - **Validates: Requirements 3.3**
    - File: `tests/todo.test.js`
  - [x] 7.12 Wire `#btn-add-task` and `#task-input` (Enter key) to `addTask`, show/hide `#task-error`, call `Storage.saveTasks` and `renderTasks` on every mutation
    - _Requirements: 3.1, 3.2, 3.8_
  - [x] 7.13 Wire edit/complete/delete controls in rendered task items to `editTask`, `toggleTask`, `deleteTask`; call `Storage.saveTasks` and `renderTasks` after each
    - _Requirements: 3.3, 3.4, 3.5, 3.6, 3.7, 3.8_

- [x] 8. Implement Quick Links logic
  - [x] 8.1 Define `links` state array and write `addLink(label, url)` — validates non-empty label and URL via `new URL()`; appends `{id, label, url}`
    - _Requirements: 4.1, 4.2_
  - [ ]* 8.2 Write property test for `addLink` with valid input (Property 15)
    - **Property 15: Adding a valid link grows the list**
    - **Validates: Requirements 4.1**
    - File: `tests/links.test.js`
  - [ ]* 8.3 Write property test for `addLink` with invalid input (Property 16)
    - **Property 16: Invalid link input is always rejected**
    - **Validates: Requirements 4.2**
    - File: `tests/links.test.js`
  - [x] 8.4 Write `deleteLink(id)` — removes the matching link from the array
    - _Requirements: 4.4_
  - [ ]* 8.5 Write property test for `deleteLink` (Property 17)
    - **Property 17: Deleting a link removes it from the list**
    - **Validates: Requirements 4.4**
    - File: `tests/links.test.js`
  - [x] 8.6 Write `renderLinks()` — clears and rebuilds `#links-list`; each item renders a `<button>` that opens the URL in a new tab and a delete control
    - _Requirements: 4.1, 4.3, 4.4_
  - [ ]* 8.7 Write unit test: link button calls `window.open` with correct URL and `'_blank'`
    - **Validates: Requirements 4.3**
    - File: `tests/links.test.js`
  - [x] 8.8 Wire `#btn-add-link` to `addLink`, show/hide `#link-error`, call `Storage.saveLinks` and `renderLinks` on every mutation; wire delete controls in rendered items
    - _Requirements: 4.1, 4.2, 4.4, 4.5_

- [x] 9. Load persisted data on startup
  - [x] 9.1 On `DOMContentLoaded`, call `Storage.getTasks()` and `Storage.getLinks()` to hydrate state, then call `renderTasks()` and `renderLinks()`
    - _Requirements: 3.9, 4.6_

- [x] 10. Final checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Each task references specific requirements for traceability
- Property tests use **fast-check** (`npm install --save-dev fast-check`) and run a minimum of 100 iterations each
- All property tests must include the comment `// Feature: personal-dashboard, Property N: <property text>`
- The Storage module must wrap all `localStorage` calls in `try/catch` and continue gracefully on failure
