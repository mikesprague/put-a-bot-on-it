import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import {
  readHistory,
  removeHistory,
  trimHistory,
  writeHistory,
} from './storage.js';

const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'storage-test-'));

beforeAll(() => {
  process.env.STORAGE_DIR = tmpDir;
});

afterAll(() => {
  delete process.env.STORAGE_DIR;
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

describe('readHistory', () => {
  it('returns [] for a missing key', () => {
    expect(readHistory('missing')).toEqual([]);
  });
});

describe('writeHistory / readHistory', () => {
  it('round-trips an array', () => {
    const value = [{ role: 'user', content: 'hi' }];
    writeHistory('roundtrip', value);
    expect(readHistory('roundtrip')).toEqual(value);
  });
});

describe('removeHistory', () => {
  it('deletes the file so a subsequent readHistory returns []', () => {
    writeHistory('todelete', [1, 2, 3]);
    removeHistory('todelete');
    expect(readHistory('todelete')).toEqual([]);
  });
});

describe('trimHistory', () => {
  it('caps history at 9 entries', () => {
    const history = Array.from({ length: 15 }, (_, i) => ({
      role: 'user',
      content: `m${i}`,
    }));
    expect(trimHistory(history).length).toBe(9);
  });

  it('leaves short history untouched', () => {
    const history = [{ role: 'user', content: 'a' }];
    expect(trimHistory(history)).toEqual(history);
  });
});
