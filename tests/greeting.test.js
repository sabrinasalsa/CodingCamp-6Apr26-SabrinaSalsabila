import { describe, it, expect, beforeEach } from 'vitest';
import fc from 'fast-check';
import {
  buildGreeting,
  saveName,
  Storage,
  getState,
  resetState,
} from '../js/app.js';

beforeEach(() => {
  localStorage.clear();
  resetState();
});

// ── Unit / Example Tests ─────────────────────────────────────────────────────

describe('Greeting — no-name example', () => {
  it('greeting without name shows phrase only (Req 2.5)', () => {
    const result = buildGreeting(9, '');
    expect(result).toBe('Good morning');
    expect(result).not.toContain(',');
  });
});

// ── Property-Based Tests ─────────────────────────────────────────────────────

describe('Greeting — Property 4: Greeting with name matches expected format', () => {
  // Feature: dashboard-enhancements, Property 4: For any hour in [0,23] and any
  // non-empty non-whitespace-only name, buildGreeting(hour, name.trim()) SHALL return
  // "[phrase], [trimmedName]".
  // Validates: Requirements 2.2, 2.7
  it('P4 — buildGreeting returns "[phrase], [name]" for non-empty name', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 23 }),
        fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0),
        (hour, name) => {
          const trimmed = name.trim();
          const result = buildGreeting(hour, trimmed);
          expect(result).toContain(', ');
          expect(result.endsWith(`, ${trimmed}`)).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('Greeting — Property 5: Whitespace-only name is cleared', () => {
  // Feature: dashboard-enhancements, Property 5: For any string composed entirely of
  // whitespace characters, calling saveName(s) SHALL result in Storage.getName() returning ''.
  // Validates: Requirements 2.6
  it('P5 — saveName(whitespace) clears storage', () => {
    fc.assert(
      fc.property(
        fc.stringOf(fc.constantFrom(' ', '\t', '\n')),
        (ws) => {
          localStorage.clear();
          saveName(ws);
          expect(Storage.getName()).toBe('');
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('Greeting — Property 6: Name persistence round-trip', () => {
  // Feature: dashboard-enhancements, Property 6: For any non-empty non-whitespace-only
  // name string s, calling Storage.saveName(s.trim()) then Storage.getName() SHALL return s.trim().
  // Validates: Requirements 2.3, 2.4
  it('P6 — saveName then getName returns trimmed name', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0),
        (name) => {
          localStorage.clear();
          const trimmed = name.trim();
          Storage.saveName(trimmed);
          expect(Storage.getName()).toBe(trimmed);
        }
      ),
      { numRuns: 100 }
    );
  });
});
