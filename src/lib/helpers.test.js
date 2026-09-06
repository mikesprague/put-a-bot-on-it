import { describe, it, expect, beforeEach, afterEach } from 'bun:test';

import {
  filterArrayOfObjects,
  makeApiCall,
  messageIncludesWord,
  messageIncludesWords,
  messageMatchesWord,
  normalizeMsgContent,
  sortArrayOfObjects,
} from './helpers.js';

describe('normalizeMsgContent', () => {
  it('lowercases and trims message content', () => {
    const msg = { content: '  HeLLo WoRLd  ' };
    expect(normalizeMsgContent(msg)).toBe('hello world');
  });
});

describe('messageMatchesWord', () => {
  it('returns true when the message exactly matches a single word', () => {
    const msg = { content: 'hello' };
    expect(messageMatchesWord(msg, 'hello')).toBe(true);
  });

  it('returns false when the message differs from the word', () => {
    const msg = { content: 'hello there' };
    expect(messageMatchesWord(msg, 'hello')).toBe(false);
  });

  it('returns true when the message exactly matches a word in an array', () => {
    const msg = { content: 'hi' };
    expect(messageMatchesWord(msg, ['hi', 'hello'])).toBe(true);
  });

  it('trims and lowercases the message before matching', () => {
    const msg = { content: '  HI  ' };
    expect(messageMatchesWord(msg, ['hi', 'hello'])).toBe(true);
  });
});

describe('messageIncludesWord', () => {
  it('returns true when the message contains the word', () => {
    const msg = { content: 'say hi there' };
    expect(messageIncludesWord(msg, 'hi')).toBe(true);
  });

  it('returns false when the message does not contain the word', () => {
    const msg = { content: 'goodbye' };
    expect(messageIncludesWord(msg, 'hi')).toBe(false);
  });
});

describe('messageIncludesWords', () => {
  it('returns true when the message contains any of the words', () => {
    const msg = { content: 'I like tacos' };
    expect(messageIncludesWords(msg, ['tacos', 'burritos'])).toBe(true);
  });

  it('returns false when the message contains none of the words', () => {
    const msg = { content: 'I like pizza' };
    expect(messageIncludesWords(msg, ['tacos', 'burritos'])).toBe(false);
  });
});

describe('sortArrayOfObjects', () => {
  it('sorts objects by the given key alphabetically', () => {
    const items = [{ name: 'Banana' }, { name: 'apple' }, { name: 'Cherry' }];
    const sorted = sortArrayOfObjects(items, 'name');
    expect(sorted.map((item) => item.name)).toEqual([
      'apple',
      'Banana',
      'Cherry',
    ]);
  });
});

describe('filterArrayOfObjects', () => {
  it('returns objects whose field matches the value case-insensitively', () => {
    const items = [{ name: 'Apple' }, { name: 'Banana' }, { name: 'apple' }];
    const filtered = filterArrayOfObjects(items, 'name', 'APPLE');
    expect(filtered.map((item) => item.name)).toEqual(['Apple', 'apple']);
  });
});

describe('makeApiCall', () => {
  let originalFetch;

  beforeEach(() => {
    originalFetch = globalThis.fetch;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  const createOkResponse = (body) => ({
    ok: true,
    status: 200,
    json: async () => body,
  });

  it('returns parsed JSON for a GET request', async () => {
    globalThis.fetch = async () => createOkResponse({ data: 'value' });
    const result = await makeApiCall('https://example.com/api');
    expect(result).toEqual({ data: 'value' });
  });

  it('sends the provided method and headers', async () => {
    let capturedConfig;
    globalThis.fetch = async (url, config) => {
      capturedConfig = config;
      return createOkResponse({ ok: true });
    };
    await makeApiCall('https://example.com/api', 'POST', {
      'Content-Type': 'application/json',
    });
    expect(capturedConfig.method).toBe('POST');
    expect(capturedConfig.headers).toEqual({
      'Content-Type': 'application/json',
    });
  });

  it('sends the body for POST requests', async () => {
    let capturedConfig;
    globalThis.fetch = async (url, config) => {
      capturedConfig = config;
      return createOkResponse({ ok: true });
    };
    await makeApiCall(
      'https://example.com/api',
      'POST',
      null,
      JSON.stringify({ foo: 'bar' })
    );
    expect(capturedConfig.body).toBe(JSON.stringify({ foo: 'bar' }));
  });

  it('does not send a body for GET requests even when one is provided', async () => {
    let capturedConfig;
    globalThis.fetch = async (url, config) => {
      capturedConfig = config;
      return createOkResponse({ ok: true });
    };
    await makeApiCall('https://example.com/api', 'GET', null, { foo: 'bar' });
    expect(capturedConfig.body).toBeUndefined();
  });
});
