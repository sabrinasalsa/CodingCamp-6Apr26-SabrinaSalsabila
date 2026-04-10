// Personal Dashboard — app logic

/**
 * Returns a zero-padded HH:MM string (24-hour) for the given Date.
 * @param {Date} date
 * @returns {string}
 */
function formatTime(date) {
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
}

/**
 * Returns a human-readable date string for the given Date,
 * e.g. "Monday, July 14, 2025".
 * @param {Date} date
 * @returns {string}
 */
function formatDate(date) {
  return new Intl.DateTimeFormat(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

/**
 * Returns a time-of-day greeting based on the given hour (0–23).
 * 05–11 → "Good morning"
 * 12–17 → "Good afternoon"
 * 18–21 → "Good evening"
 * 22–23, 0–4 → "Good night"
 * @param {number} hour — integer in [0, 23]
 * @returns {string}
 */
function getGreeting(hour) {
  if (hour >= 5 && hour <= 11) return 'Good morning';
  if (hour >= 12 && hour <= 17) return 'Good afternoon';
  if (hour >= 18 && hour <= 21) return 'Good evening';
  return 'Good night';
}

// ── Theme ────────────────────────────────────────────────────────────────────

let currentTheme = 'light';

/**
 * Applies the given theme by setting data-theme on <html> and updating the
 * toggle button label.
 * @param {'light'|'dark'} theme
 */
function applyTheme(theme) {
  currentTheme = theme;
  document.documentElement.setAttribute('data-theme', theme);
  const btn = document.getElementById('btn-theme-toggle');
  if (btn) {
    btn.textContent = theme === 'dark' ? '☀ Light' : '☾ Dark';
  }
}

/**
 * Flips the current theme, applies it, and persists the choice to Storage.
 */
function toggleTheme() {
  const next = currentTheme === 'light' ? 'dark' : 'light';
  applyTheme(next);
  Storage.saveTheme(next);
}

// ── Greeting Widget ──────────────────────────────────────────────────────────

let userName = '';

/**
 * Returns a greeting string combining the time-of-day phrase with an optional name.
 * @param {number} hour — integer in [0, 23]
 * @param {string} name — trimmed display name, or '' for no name
 * @returns {string}
 */
function buildGreeting(hour, name) {
  const phrase = getGreeting(hour);
  return name ? `${phrase}, ${name}` : phrase;
}

/**
 * Trims the given name, updates userName, persists to Storage, and re-renders.
 * @param {string} name
 */
function saveName(name) {
  const trimmed = name.trim();
  userName = trimmed;
  Storage.saveName(trimmed);
  renderGreeting();
}

/**
 * Reads userName and the current Date, then updates #greeting-text.
 */
function renderGreeting() {
  const now = new Date();
  document.getElementById('greeting-text').textContent = buildGreeting(now.getHours(), userName);
}

function updateGreeting() {
  const now = new Date();
  document.getElementById('greeting-text').textContent = buildGreeting(now.getHours(), userName);
  document.getElementById('time-display').textContent  = formatTime(now);
  document.getElementById('date-display').textContent  = formatDate(now);
}

// ── Focus Timer ──────────────────────────────────────────────────────────────

// Task 4.1 — timerState + formatTimer
let configuredDuration = 1500;
let timerState = { remaining: 1500, running: false, complete: false };
let timerInterval = null;

/**
 * Returns a zero-padded MM:SS string for the given number of seconds.
 * @param {number} seconds
 * @returns {string}
 */
function formatTimer(seconds) {
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');
  return `${mm}:${ss}`;
}

// Task 4.3 — timerTick
function timerTick() {
  timerState.remaining -= 1;
  if (timerState.remaining <= 0) {
    timerState.remaining = 0;
    timerState.running = false;
    timerState.complete = true;
    clearInterval(timerInterval);
    timerInterval = null;
  }
  renderTimer();
}

// Task 4.5 — timerStop
function timerStop() {
  timerState.running = false;
  clearInterval(timerInterval);
  timerInterval = null;
  renderTimer();
}

// Task 4.7 — timerReset
function timerReset() {
  clearInterval(timerInterval);
  timerInterval = null;
  timerState = { remaining: configuredDuration, running: false, complete: false };
  renderTimer();
}

/**
 * Validates a duration value. Returns {ok: true, minutes: n} for valid positive
 * integers in [1, 180], or {ok: false, error: string} otherwise.
 * @param {*} value
 * @returns {{ok: boolean, minutes?: number, error?: string}}
 */
function validateDuration(value) {
  const num = Number(value);
  if (typeof value === 'string' && value.trim() === '') {
    return { ok: false, error: 'Please enter a duration.' };
  }
  if (!Number.isInteger(num)) {
    return { ok: false, error: 'Duration must be a whole number.' };
  }
  if (num < 1) {
    return { ok: false, error: 'Duration must be at least 1 minute.' };
  }
  if (num > 180) {
    return { ok: false, error: 'Duration cannot exceed 180 minutes.' };
  }
  return { ok: true, minutes: num };
}

/**
 * Updates configuredDuration to minutes * 60, resets the timer, and persists.
 * @param {number} minutes
 */
function setDuration(minutes) {
  configuredDuration = minutes * 60;
  timerReset();
  Storage.saveDuration(minutes);
}

// Task 4.9 — renderTimer
function renderTimer() {
  const display = document.getElementById('timer-display');
  display.textContent = formatTimer(timerState.remaining);
  document.getElementById('btn-start').disabled = timerState.running;
  document.getElementById('btn-stop').disabled = !timerState.running;
  display.parentElement.classList.toggle('timer-complete', timerState.complete);
  const durationInput = document.getElementById('duration-input');
  const btnSetDuration = document.getElementById('btn-set-duration');
  if (durationInput) durationInput.disabled = timerState.running;
  if (btnSetDuration) btnSetDuration.disabled = timerState.running;
}

// ── Storage ──────────────────────────────────────────────────────────────────

const Storage = {
  getTasks() {
    try {
      return JSON.parse(localStorage.getItem('pd_tasks')) || [];
    } catch (e) {
      console.warn('Storage.getTasks failed:', e);
      return [];
    }
  },
  saveTasks(tasks) {
    try {
      localStorage.setItem('pd_tasks', JSON.stringify(tasks));
    } catch (e) {
      console.warn('Storage.saveTasks failed:', e);
    }
  },
  getLinks() {
    try {
      return JSON.parse(localStorage.getItem('pd_links')) || [];
    } catch (e) {
      console.warn('Storage.getLinks failed:', e);
      return [];
    }
  },
  saveLinks(links) {
    try {
      localStorage.setItem('pd_links', JSON.stringify(links));
    } catch (e) {
      console.warn('Storage.saveLinks failed:', e);
    }
  },
  getTheme() {
    try {
      return localStorage.getItem('pd_theme') || 'light';
    } catch (e) {
      console.warn('Storage.getTheme failed:', e);
      return 'light';
    }
  },
  saveTheme(theme) {
    try {
      localStorage.setItem('pd_theme', theme);
    } catch (e) {
      console.warn('Storage.saveTheme failed:', e);
    }
  },
  getName() {
    try {
      return (localStorage.getItem('pd_name') || '').trim();
    } catch (e) {
      console.warn('Storage.getName failed:', e);
      return '';
    }
  },
  saveName(name) {
    try {
      const trimmed = name.trim();
      if (trimmed === '') {
        localStorage.removeItem('pd_name');
      } else {
        localStorage.setItem('pd_name', trimmed);
      }
    } catch (e) {
      console.warn('Storage.saveName failed:', e);
    }
  },
  getDuration() {
    try {
      const val = parseInt(localStorage.getItem('pd_duration'), 10);
      return isNaN(val) ? 25 : val;
    } catch (e) {
      console.warn('Storage.getDuration failed:', e);
      return 25;
    }
  },
  saveDuration(mins) {
    try {
      localStorage.setItem('pd_duration', String(parseInt(mins, 10)));
    } catch (e) {
      console.warn('Storage.saveDuration failed:', e);
    }
  },
};

// ── To-Do List ───────────────────────────────────────────────────────────────

// Task 7.1 — tasks state + addTask
let tasks = [];

function addTask(label) {
  const trimmed = label.trim();
  if (!trimmed) return false;
  tasks.push({ id: Date.now().toString(), label: trimmed, completed: false });
  return true;
}

// Task 7.4 — editTask
function editTask(id, newLabel) {
  const trimmed = newLabel.trim();
  if (!trimmed) return false;
  const task = tasks.find(t => t.id === id);
  if (task) task.label = trimmed;
  return true;
}

// Task 7.6 — toggleTask
function toggleTask(id) {
  const task = tasks.find(t => t.id === id);
  if (task) task.completed = !task.completed;
}

// Task 7.8 — deleteTask
function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
}

// Task 7.10 — renderTasks
function renderTasks() {
  const list = document.getElementById('task-list');
  list.innerHTML = '';

  tasks.forEach(function (task) {
    const li = document.createElement('li');
    if (task.completed) li.classList.add('task-completed');

    // Checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;

    // Label span
    const span = document.createElement('span');
    span.textContent = task.label;

    // Edit input (hidden by default)
    const editInput = document.createElement('input');
    editInput.type = 'text';
    editInput.value = task.label;
    editInput.hidden = true;

    // Edit/Save button
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.dataset.id = task.id;

    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.dataset.id = task.id;

    // Inline error for edit
    const inlineError = document.createElement('span');
    inlineError.className = 'error-msg';
    inlineError.hidden = true;

    // Task 7.13 — wire checkbox
    checkbox.addEventListener('change', function () {
      toggleTask(task.id);
      Storage.saveTasks(tasks);
      renderTasks();
    });

    // Task 7.13 — wire edit/save button
    editBtn.addEventListener('click', function () {
      if (editBtn.textContent === 'Edit') {
        span.hidden = true;
        editInput.hidden = false;
        editInput.focus();
        editBtn.textContent = 'Save';
      } else {
        const result = editTask(task.id, editInput.value);
        if (!result) {
          inlineError.textContent = 'Task cannot be empty.';
          inlineError.hidden = false;
        } else {
          inlineError.hidden = true;
          Storage.saveTasks(tasks);
          renderTasks();
        }
      }
    });

    // Task 7.13 — wire delete button
    deleteBtn.addEventListener('click', function () {
      deleteTask(task.id);
      Storage.saveTasks(tasks);
      renderTasks();
    });

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(editInput);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);
    li.appendChild(inlineError);
    list.appendChild(li);
  });
}

// ── Quick Links ──────────────────────────────────────────────────────────────

// Task 8.1 — links state + addLink
let links = [];

function addLink(label, url) {
  const trimmedLabel = label.trim();
  if (!trimmedLabel) return false;
  try {
    new URL(url);
  } catch (e) {
    return false;
  }
  links.push({ id: Date.now().toString(), label: trimmedLabel, url });
  return true;
}

// Task 8.4 — deleteLink
function deleteLink(id) {
  links = links.filter(l => l.id !== id);
}

// Task 8.6 — renderLinks
function renderLinks() {
  const container = document.getElementById('links-list');
  container.innerHTML = '';

  links.forEach(function (link) {
    const li = document.createElement('li');

    const openBtn = document.createElement('button');
    openBtn.textContent = link.label;
    openBtn.addEventListener('click', function () {
      window.open(link.url, '_blank');
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', function () {
      deleteLink(link.id);
      Storage.saveLinks(links);
      renderLinks();
    });

    li.appendChild(openBtn);
    li.appendChild(deleteBtn);
    container.appendChild(li);
  });
}

document.addEventListener('DOMContentLoaded', function () {
  // Load and apply persisted theme before any render
  applyTheme(Storage.getTheme());
  document.getElementById('btn-theme-toggle').addEventListener('click', toggleTheme);

  // Load persisted name and wire name input controls
  userName = Storage.getName();
  document.getElementById('btn-save-name').addEventListener('click', function () {
    saveName(document.getElementById('name-input').value);
  });
  document.getElementById('name-input').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') saveName(e.target.value);
  });

  updateGreeting();
  setInterval(updateGreeting, 1000);

  // Task 4.12 — Wire timer button handlers
  document.getElementById('btn-start').addEventListener('click', function () {
    if (timerState.running) return;
    timerState.running = true;
    clearInterval(timerInterval);
    timerInterval = setInterval(timerTick, 1000);
    renderTimer();
  });

  document.getElementById('btn-stop').addEventListener('click', timerStop);
  document.getElementById('btn-reset').addEventListener('click', timerReset);

  // Load persisted duration and wire duration input controls
  setDuration(Storage.getDuration());

  document.getElementById('btn-set-duration').addEventListener('click', function () {
    const input = document.getElementById('duration-input');
    const error = document.getElementById('duration-error');
    const result = validateDuration(input.value);
    if (result.ok) {
      setDuration(result.minutes);
      error.hidden = true;
    } else {
      error.textContent = result.error;
      error.hidden = false;
    }
  });

  renderTimer();

  // Task 7.12 — Wire add-task controls
  function handleAddTask() {
    const input = document.getElementById('task-input');
    const error = document.getElementById('task-error');
    const result = addTask(input.value);
    if (!result) {
      error.textContent = 'Task cannot be empty.';
      error.hidden = false;
    } else {
      input.value = '';
      error.hidden = true;
      Storage.saveTasks(tasks);
      renderTasks();
    }
  }

  document.getElementById('btn-add-task').addEventListener('click', handleAddTask);

  document.getElementById('task-input').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') handleAddTask();
  });

  // Task 9.1 (tasks) — hydrate from storage on load
  tasks = Storage.getTasks();
  renderTasks();

  // Task 8.8 — Wire add-link controls
  document.getElementById('btn-add-link').addEventListener('click', function () {
    const labelInput = document.getElementById('link-label-input');
    const urlInput   = document.getElementById('link-url-input');
    const error      = document.getElementById('link-error');
    const result = addLink(labelInput.value, urlInput.value);
    if (!result) {
      const labelEmpty = !labelInput.value.trim();
      error.textContent = labelEmpty ? 'Label cannot be empty.' : 'Please enter a valid URL.';
      error.hidden = false;
    } else {
      labelInput.value = '';
      urlInput.value   = '';
      error.hidden = true;
      Storage.saveLinks(links);
      renderLinks();
    }
  });

  // Task 9.1 (links) — hydrate from storage on load
  links = Storage.getLinks();
  renderLinks();
});

// ── Test Exports ─────────────────────────────────────────────────────────────
// Exported for unit/property-based tests only; not used by the browser bundle.
// The `export` keyword is only valid in ES module context (vitest imports this
// file as a module). In the browser the script tag has no type="module" so
// these lines are never reached via a normal page load — they are only parsed
// when the file is imported as a module by the test runner.
export {
  applyTheme, toggleTheme, buildGreeting, saveName, renderGreeting,
  validateDuration, setDuration, timerReset, renderTimer,
  Storage,
  getGreeting,
};
export function getState() {
  return { currentTheme, userName, configuredDuration, timerState };
}
export function resetState() {
  currentTheme = 'light';
  userName = '';
  configuredDuration = 1500;
  timerState = { remaining: 1500, running: false, complete: false };
  if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
}
