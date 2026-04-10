# Requirements Document

## Introduction

Three enhancements to the existing personal dashboard web app (vanilla HTML/CSS/JS):

1. **Light / Dark mode toggle** — users can switch between a light and dark color theme, with the preference persisted across sessions.
2. **Custom name in greeting** — users can enter their name so the greeting reads e.g. "Good morning, Alex" instead of just "Good morning".
3. **Configurable Pomodoro duration** — users can set a custom focus timer duration instead of being fixed at 25 minutes.

All enhancements follow the existing architecture: no build step, no framework, one HTML file, one CSS file, one JS file, Local Storage for persistence.

## Glossary

- **Dashboard**: The existing single-page web application rendered in the browser.
- **Theme_Toggle**: The UI control that switches the Dashboard between light and dark color themes.
- **Light_Theme**: The default color scheme using light backgrounds and dark text.
- **Dark_Theme**: The alternative color scheme using dark backgrounds and light text.
- **Greeting_Widget**: The existing UI component that displays the current time, date, and a time-based greeting message.
- **Name_Input**: The UI control inside the Greeting_Widget that allows the user to enter and save their display name.
- **Focus_Timer**: The existing UI component that implements a countdown timer with start, stop, and reset controls.
- **Duration_Input**: The UI control inside the Focus_Timer that allows the user to set a custom countdown duration in minutes.
- **Storage**: The browser's Local Storage API used to persist user data across sessions.

---

## Requirements

### Requirement 1: Light / Dark Mode Toggle

**User Story:** As a user, I want to toggle between a light and dark color theme, so that I can use the dashboard comfortably in different lighting conditions.

#### Acceptance Criteria

1. THE Dashboard SHALL provide a Theme_Toggle control that is visible at all times.
2. WHEN the user activates the Theme_Toggle, THE Dashboard SHALL switch from the Light_Theme to the Dark_Theme, or from the Dark_Theme to the Light_Theme.
3. WHILE the Dark_Theme is active, THE Dashboard SHALL apply dark background colors and light foreground colors to all widgets and the page background.
4. WHILE the Light_Theme is active, THE Dashboard SHALL apply the default light background colors and dark foreground colors to all widgets and the page background.
5. WHEN the user activates the Theme_Toggle, THE Storage SHALL persist the selected theme preference to Local Storage.
6. WHEN the Dashboard loads, THE Dashboard SHALL retrieve the saved theme preference from Local Storage and apply it before rendering any content.
7. IF no theme preference is saved in Local Storage, THEN THE Dashboard SHALL apply the Light_Theme by default.
8. THE Theme_Toggle SHALL display a visible label or icon that reflects the currently active theme.

---

### Requirement 2: Custom Name in Greeting

**User Story:** As a user, I want to enter my name so that the greeting addresses me personally, making the dashboard feel more welcoming.

#### Acceptance Criteria

1. THE Greeting_Widget SHALL provide a Name_Input control that allows the user to enter a display name.
2. WHEN the user submits a non-empty name via the Name_Input, THE Greeting_Widget SHALL display the greeting in the format "[greeting phrase], [name]" (e.g., "Good morning, Alex").
3. WHEN the user submits a non-empty name via the Name_Input, THE Storage SHALL persist the name to Local Storage.
4. WHEN the Dashboard loads, THE Greeting_Widget SHALL retrieve the saved name from Local Storage and include it in the greeting if a name is present.
5. IF no name is saved in Local Storage, THEN THE Greeting_Widget SHALL display the greeting phrase without a name suffix (e.g., "Good morning").
6. IF the user submits an empty or whitespace-only name, THEN THE Greeting_Widget SHALL clear the saved name from Local Storage and display the greeting phrase without a name suffix.
7. THE Greeting_Widget SHALL trim leading and trailing whitespace from the entered name before saving or displaying it.

---

### Requirement 3: Configurable Pomodoro Duration

**User Story:** As a user, I want to set a custom focus timer duration, so that I can adapt the Pomodoro technique to my preferred work intervals.

#### Acceptance Criteria

1. THE Focus_Timer SHALL provide a Duration_Input control that allows the user to enter a duration in whole minutes.
2. WHEN the user submits a valid duration via the Duration_Input, THE Focus_Timer SHALL update the countdown to the new duration (in seconds) and reset to a stopped state.
3. WHEN the user activates the reset control, THE Focus_Timer SHALL return the countdown to the most recently configured duration, not necessarily 25 minutes.
4. IF the user submits a duration that is not a positive integer, THEN THE Focus_Timer SHALL not change the current duration and SHALL display an inline validation message.
5. IF the user submits a duration less than 1 minute or greater than 180 minutes, THEN THE Focus_Timer SHALL not change the current duration and SHALL display an inline validation message.
6. WHEN the user submits a valid duration, THE Storage SHALL persist the custom duration to Local Storage.
7. WHEN the Dashboard loads, THE Focus_Timer SHALL retrieve the saved duration from Local Storage and initialize the countdown to that value.
8. IF no duration is saved in Local Storage, THEN THE Focus_Timer SHALL initialize the countdown to 25 minutes (1500 seconds).
9. WHILE the Focus_Timer is counting down, THE Focus_Timer SHALL disable the Duration_Input control and its submit control.
