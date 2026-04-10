# Requirements Document

## Introduction

A personal dashboard web app built with HTML, CSS, and vanilla JavaScript. It runs entirely in the browser with no backend, using Local Storage for persistence. The dashboard provides a greeting with time/date, a focus timer, a to-do list, and quick links — all in a clean, minimal interface.

## Glossary

- **Dashboard**: The main single-page web application rendered in the browser.
- **Greeting_Widget**: The UI component that displays the current time, date, and a time-based greeting message.
- **Focus_Timer**: The UI component that implements a 25-minute countdown timer with start, stop, and reset controls.
- **Todo_List**: The UI component that manages a list of user tasks with add, edit, complete, and delete operations.
- **Quick_Links**: The UI component that displays user-defined shortcut buttons that open URLs in the browser.
- **Storage**: The browser's Local Storage API used to persist user data across sessions.
- **Task**: A single to-do item with a text label and a completion state.
- **Link**: A user-defined entry consisting of a label and a URL stored in Quick_Links.

---

## Requirements

### Requirement 1: Time and Date Display

**User Story:** As a user, I want to see the current time and date when I open the dashboard, so that I have an at-a-glance view of when I am.

#### Acceptance Criteria

1. THE Greeting_Widget SHALL display the current time in HH:MM format, updated every second.
2. THE Greeting_Widget SHALL display the current date in a human-readable format (e.g., "Monday, July 14, 2025").
3. WHEN the local time is between 05:00 and 11:59, THE Greeting_Widget SHALL display the message "Good morning".
4. WHEN the local time is between 12:00 and 17:59, THE Greeting_Widget SHALL display the message "Good afternoon".
5. WHEN the local time is between 18:00 and 21:59, THE Greeting_Widget SHALL display the message "Good evening".
6. WHEN the local time is between 22:00 and 04:59, THE Greeting_Widget SHALL display the message "Good night".

---

### Requirement 2: Focus Timer

**User Story:** As a user, I want a 25-minute countdown timer, so that I can use the Pomodoro technique to stay focused.

#### Acceptance Criteria

1. THE Focus_Timer SHALL initialize with a countdown value of 25 minutes (1500 seconds).
2. WHEN the user activates the start control, THE Focus_Timer SHALL begin counting down one second per second.
3. WHEN the Focus_Timer is counting down and the user activates the stop control, THE Focus_Timer SHALL pause the countdown at the current value.
4. WHEN the user activates the reset control, THE Focus_Timer SHALL return the countdown value to 25 minutes and stop counting.
5. WHEN the countdown reaches zero, THE Focus_Timer SHALL stop counting and display a visual indication that the session is complete.
6. THE Focus_Timer SHALL display the remaining time in MM:SS format at all times.
7. WHILE the Focus_Timer is counting down, THE Focus_Timer SHALL disable the start control and enable the stop control.
8. WHILE the Focus_Timer is stopped or paused, THE Focus_Timer SHALL enable the start control and disable the stop control.

---

### Requirement 3: To-Do List

**User Story:** As a user, I want to manage a list of tasks, so that I can track what I need to do during my session.

#### Acceptance Criteria

1. WHEN the user submits a non-empty task label, THE Todo_List SHALL add a new Task to the list and display it.
2. IF the user submits an empty or whitespace-only task label, THEN THE Todo_List SHALL not add a Task and SHALL display an inline validation message.
3. WHEN the user activates the edit control on a Task, THE Todo_List SHALL display the Task label in an editable input field.
4. WHEN the user confirms an edit with a non-empty label, THE Todo_List SHALL update the Task label and return to the display state.
5. IF the user confirms an edit with an empty or whitespace-only label, THEN THE Todo_List SHALL not save the change and SHALL display an inline validation message.
6. WHEN the user activates the complete control on a Task, THE Todo_List SHALL toggle the Task's completion state and apply a visual distinction to completed Tasks.
7. WHEN the user activates the delete control on a Task, THE Todo_List SHALL remove the Task from the list.
8. WHEN any Task is added, edited, completed, or deleted, THE Storage SHALL persist the updated Task list to Local Storage.
9. WHEN the Dashboard loads, THE Todo_List SHALL retrieve and render all Tasks previously saved in Local Storage.

---

### Requirement 4: Quick Links

**User Story:** As a user, I want to save and access my favorite websites from the dashboard, so that I can navigate to them quickly without typing URLs.

#### Acceptance Criteria

1. WHEN the user submits a valid label and URL, THE Quick_Links SHALL add a new Link and display it as a button.
2. IF the user submits a missing label or an invalid URL, THEN THE Quick_Links SHALL not add the Link and SHALL display an inline validation message.
3. WHEN the user activates a Link button, THE Quick_Links SHALL open the associated URL in a new browser tab.
4. WHEN the user activates the delete control on a Link, THE Quick_Links SHALL remove the Link from the display.
5. WHEN any Link is added or deleted, THE Storage SHALL persist the updated Link list to Local Storage.
6. WHEN the Dashboard loads, THE Quick_Links SHALL retrieve and render all Links previously saved in Local Storage.

---

### Requirement 5: Layout and Responsiveness

**User Story:** As a user, I want the dashboard to be readable and usable on different screen sizes, so that I can use it on any device.

#### Acceptance Criteria

1. THE Dashboard SHALL render all four widgets (Greeting_Widget, Focus_Timer, Todo_List, Quick_Links) in a single HTML file.
2. THE Dashboard SHALL apply all visual styles from exactly one external CSS file.
3. THE Dashboard SHALL apply all interactive behavior from exactly one external JavaScript file.
4. WHEN the viewport width is 768px or wider, THE Dashboard SHALL display widgets in a multi-column grid layout.
5. WHEN the viewport width is below 768px, THE Dashboard SHALL display widgets in a single-column stacked layout.
6. THE Dashboard SHALL load and render all widgets within 2 seconds on a standard broadband connection with no external network requests required.
