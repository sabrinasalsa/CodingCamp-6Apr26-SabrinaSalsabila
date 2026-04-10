import { describe, it, expect, beforeEach } from 'vitest';
import fc from 'fast-check';
import {
  applyTheme,
  toggleTheme,
  Storage,
  getState,
  resetState,
} from '../js/app.js';

beforeEach(() => {
  localStorage.clear();
  resetState();
  // Reset html data-theme
  document.documentElement.removeAttribute('data-theme');
  // Reset toggle button text
  const btn = document.getElementById('btn-theme-toggle');
  if (btn) btn.textContent = '☾ Dark';
});

// ── Unit / Example Tests ─────────────────────────────────────────────────────

describe('Theme — DOM presence', () => {
  it('theme toggle button exists in DOM', () => {
    expect(document.getElementById('btn-theme-toggle')).not.toBeNull();
  });
});

describe('Theme — default', () => {
  it('default theme is light when localStorage is empty (Req 1.7)', () => {
    localStorage.clear();
    const theme = Storage.getTheme();
    expect(theme).toBe('light');
  });
});

// ── Property-Based Tests ─────────────────────────────────────────────────────

describe('Theme — Property 1: Theme toggle is a round-trip', () => {
  // Feature: dashboard-enhancements, Property 1: For any theme value in {'light','dark'},
  // calling toggleTheme twice SHALL return the theme to its original value.
  // Validates: Requirements 1.2
  it('P1 — toggleTheme twice returns to original theme', () => {
    fc.assert(
      fc.property(fc.constantFrom('light', 'dark'), (startTheme) => {
        resetState();
        localStorage.clear();
        applyTheme(startTheme);
        const before = getState().currentTheme;
        toggleTheme();
        toggleTheme();
        const after = getState().currentTheme;
        expect(after).toBe(before);
      }),
      { numRuns: 100 }
    );
  });
});

describe('Theme — Property 2: Theme persistence round-trip', () => {
  // Feature: dashboard-enhancements, Property 2: For any theme value in {'light','dark'},
  // calling Storage.saveTheme(theme) then Storage.getTheme() SHALL return the same value.
  // Validates: Requirements 1.5, 1.6
  it('P2 — saveTheme then getTheme returns same value', () => {
    fc.assert(
      fc.property(fc.constantFrom('light', 'dark'), (theme) => {
        localStorage.clear();
        Storage.saveTheme(theme);
        expect(Storage.getTheme()).toBe(theme);
      }),
      { numRuns: 100 }
    );
  });
});

describe('Theme — Property 3: Toggle label reflects active theme', () => {
  // Feature: dashboard-enhancements, Property 3: For any theme value, after calling
  // applyTheme(theme), the toggle button's textContent SHALL identify the current theme.
  // Validates: Requirements 1.8
  it('P3 — applyTheme sets correct label on toggle button', () => {
    fc.assert(
      fc.property(fc.constantFrom('light', 'dark'), (theme) => {
        applyTheme(theme);
        const btn = document.getElementById('btn-theme-toggle');
        if (theme === 'dark') {
          expect(btn.textContent).toContain('Light');
        } else {
          expect(btn.textContent).toContain('Dark');
        }
      }),
      { numRuns: 100 }
    );
  });
});
