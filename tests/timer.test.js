import { describe, it, expect, beforeEach } from 'vitest';
import fc from 'fast-check';
import {
  validateDuration,
  setDuration,
  timerReset,
  renderTimer,
  Storage,
  getState,
  resetState,
} from '../js/app.js';

beforeEach(() => {
  localStorage.clear();
  resetState();
});

// ── Unit / Example Tests ─────────────────────────────────────────────────────

describe('Timer — default duration', () => {
  it('default duration is 1500 s when localStorage is empty (Req 3.8)', () => {
    localStorage.clear();
    resetState();
    // configuredDuration starts at 1500 (25 min) before any Storage load
    expect(getState().configuredDuration).toBe(1500);
    expect(getState().timerState.remaining).toBe(1500);
  });
});

// ── Property-Based Tests ─────────────────────────────────────────────────────

describe('Timer — Property 7: Valid duration sets timer to correct seconds', () => {
  // Feature: dashboard-enhancements, Property 7: For any integer n in [1,180],
  // calling setDuration(n) SHALL produce timerState.remaining === n*60,
  // timerState.running === false, and timerState.complete === false.
  // Validates: Requirements 3.2
  it('P7 — setDuration(n) sets remaining to n*60 and resets state', () => {
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 180 }), (n) => {
        resetState();
        setDuration(n);
        const { timerState } = getState();
        expect(timerState.remaining).toBe(n * 60);
        expect(timerState.running).toBe(false);
        expect(timerState.complete).toBe(false);
      }),
      { numRuns: 100 }
    );
  });
});

describe('Timer — Property 8: Reset restores configured duration', () => {
  // Feature: dashboard-enhancements, Property 8: For any valid duration n in [1,180],
  // after setDuration(n) and then timerReset(), timerState.remaining SHALL equal n*60.
  // Validates: Requirements 3.3
  it('P8 — timerReset() after setDuration(n) restores remaining to n*60', () => {
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 180 }), (n) => {
        resetState();
        setDuration(n);
        timerReset();
        const { timerState } = getState();
        expect(timerState.remaining).toBe(n * 60);
      }),
      { numRuns: 100 }
    );
  });
});

describe('Timer — Property 9: Invalid duration is rejected', () => {
  // Feature: dashboard-enhancements, Property 9: For any value that is not a positive
  // integer in [1,180], validateDuration(value) SHALL return {ok: false}.
  // Validates: Requirements 3.4, 3.5
  it('P9 — validateDuration returns {ok:false} for out-of-range or non-integer values', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.integer({ max: 0 }),
          fc.integer({ min: 181 }),
          fc.double({ noNaN: true }).filter((n) => !Number.isInteger(n)),
          fc.string().filter((s) => isNaN(Number(s)) || s.trim() === '')
        ),
        (value) => {
          const result = validateDuration(value);
          expect(result.ok).toBe(false);
          expect(result.error).toBeTruthy();
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('Timer — Property 10: Duration persistence round-trip', () => {
  // Feature: dashboard-enhancements, Property 10: For any integer n in [1,180],
  // calling Storage.saveDuration(n) then Storage.getDuration() SHALL return n.
  // Validates: Requirements 3.6, 3.7
  it('P10 — saveDuration then getDuration returns same value', () => {
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 180 }), (n) => {
        localStorage.clear();
        Storage.saveDuration(n);
        expect(Storage.getDuration()).toBe(n);
      }),
      { numRuns: 100 }
    );
  });
});

describe('Timer — Property 11: Duration input disabled while running', () => {
  // Feature: dashboard-enhancements, Property 11: For any timerState with running===true,
  // calling renderTimer() SHALL set #duration-input.disabled and #btn-set-duration.disabled to true.
  // Validates: Requirements 3.9
  it('P11 — renderTimer() disables duration controls when timer is running', () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 1500 }), (remaining) => {
        resetState();
        // Manually set timerState to running
        const state = getState();
        state.timerState.remaining = remaining;
        state.timerState.running = true;
        // Update the module's timerState via setDuration then manually patch
        // We use renderTimer directly after patching via the exported state ref
        // Since getState() returns the live object, mutating it affects renderTimer
        renderTimer();
        expect(document.getElementById('duration-input').disabled).toBe(true);
        expect(document.getElementById('btn-set-duration').disabled).toBe(true);
      }),
      { numRuns: 100 }
    );
  });
});
