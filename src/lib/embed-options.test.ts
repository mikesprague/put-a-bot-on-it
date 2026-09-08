import { describe, it, expect } from 'bun:test';

import { commands } from './embed-options.ts';

describe('embed-options', () => {
  it('exports a non-empty list of commands', () => {
    expect(commands.length).toBeGreaterThan(0);
  });

  it('gives every command a name, value, and emoji (or null)', () => {
    for (const command of commands) {
      expect(typeof command.name).toBe('string');
      expect(typeof command.value).toBe('string');
      expect(Array.isArray(command.emoji) || command.emoji === null).toBe(true);
    }
  });
});
