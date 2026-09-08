import { describe, it, expect } from 'bun:test';

import {
  birdEmojis,
  birdSynonyms,
  customEmoji,
  greetingStrings,
  greetings,
  insultStrings,
  kanyeHeads,
  poopStrings,
  speakStrings,
} from './lists.ts';

describe('lists', () => {
  it('exports a non-empty list of bird synonyms', () => {
    expect(birdSynonyms.length).toBeGreaterThan(0);
  });

  it('exports a non-empty list of bird emojis', () => {
    expect(birdEmojis.length).toBeGreaterThan(0);
  });

  it('exports a non-empty list of greetings', () => {
    expect(greetings.length).toBeGreaterThan(0);
  });

  it('exports a non-empty list of insult strings', () => {
    expect(insultStrings.length).toBeGreaterThan(0);
  });

  it('exports non-empty lists of strings', () => {
    for (const list of [
      birdEmojis,
      greetingStrings,
      greetings,
      insultStrings,
      kanyeHeads,
      poopStrings,
      speakStrings,
    ]) {
      expect(list.length).toBeGreaterThan(0);
      expect(list.every((item) => typeof item === 'string')).toBe(true);
    }
  });

  it('exports custom emoji as a map of string values', () => {
    expect(Object.keys(customEmoji).length).toBeGreaterThan(0);
    expect(Object.values(customEmoji).every((v) => typeof v === 'string')).toBe(
      true
    );
  });
});
