import { describe, it, expect, beforeEach, afterEach } from 'bun:test';

import { MessageFlags } from 'discord.js';

import {
  filterArrayOfObjects,
  generateImageAttachment,
  getCustomEmojiCode,
  getKlipyGifs,
  getRandomBirdEmoji,
  getRandomColor,
  getRandomGifByTerm,
  getRandomNum,
  makeApiCall,
  messageIncludesWord,
  messageIncludesWords,
  messageMatchesWord,
  normalizeMsgContent,
  prepareEmbed,
  registerKlipyGifShare,
  sendContent,
  sendEmbed,
  sortArrayOfObjects,
  wait,
} from './helpers.js';
import { birdEmojis, customEmoji } from './lists.js';

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

describe('getRandomNum', () => {
  it('returns an integer within the range [0, maxValue)', () => {
    const num = getRandomNum(10);
    expect(Number.isInteger(num)).toBe(true);
    expect(num).toBeGreaterThanOrEqual(0);
    expect(num).toBeLessThan(10);
  });
});

describe('getRandomColor', () => {
  it('returns a hex color string', () => {
    expect(getRandomColor()).toMatch(/^#[0-9a-f]{6}$/i);
  });
});

describe('getRandomBirdEmoji', () => {
  it('returns an emoji from the birdEmojis list', () => {
    expect(birdEmojis).toContain(getRandomBirdEmoji());
  });
});

describe('getCustomEmojiCode', () => {
  it('returns the emoji code for a known name', () => {
    expect(getCustomEmojiCode('steve')).toBe(customEmoji.steve);
  });

  it('trims whitespace from the name', () => {
    expect(getCustomEmojiCode('  steve  ')).toBe(customEmoji.steve);
  });

  it('returns undefined for an unknown name', () => {
    expect(getCustomEmojiCode('not-a-real-emoji')).toBeUndefined();
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

  it('sends the body for PUT requests', async () => {
    let capturedConfig;
    globalThis.fetch = async (url, config) => {
      capturedConfig = config;
      return createOkResponse({ ok: true });
    };
    await makeApiCall('https://example.com/api', 'PUT', null, { foo: 'bar' });
    expect(capturedConfig.body).toEqual({ foo: 'bar' });
  });

  it('sends the body when the method is lowercase', async () => {
    let capturedConfig;
    globalThis.fetch = async (url, config) => {
      capturedConfig = config;
      return createOkResponse({ ok: true });
    };
    await makeApiCall('https://example.com/api', 'post', null, { foo: 'bar' });
    expect(capturedConfig.body).toEqual({ foo: 'bar' });
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

  it('throws when the response status is not ok', async () => {
    globalThis.fetch = async () => ({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      json: async () => ({ error: 'server error' }),
    });
    await expect(makeApiCall('https://example.com/api')).rejects.toThrow(
      'HTTP 500: Internal Server Error'
    );
  });
});

describe('getKlipyGifs', () => {
  let originalFetch;
  let originalKey;

  beforeEach(() => {
    originalFetch = globalThis.fetch;
    originalKey = process.env.KLIPY_API_KEY;
    process.env.KLIPY_API_KEY = 'test-key';
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    process.env.KLIPY_API_KEY = originalKey;
  });

  it('returns gif data from the primary request', async () => {
    let callCount = 0;
    globalThis.fetch = async () => {
      callCount += 1;
      return {
        ok: true,
        status: 200,
        json: async () => ({ data: { data: [{ id: 1 }] } }),
      };
    };
    const result = await getKlipyGifs({ searchTerm: 'party' });
    expect(result).toEqual([{ id: 1 }]);
    expect(callCount).toBe(1);
  });

  it('falls back to the backup search when the primary is empty', async () => {
    const responses = [{ data: { data: [] } }, { data: { data: [{ id: 2 }] } }];
    let callCount = 0;
    globalThis.fetch = async () => {
      const body = responses[callCount];
      callCount += 1;
      return { ok: true, status: 200, json: async () => body };
    };
    const result = await getKlipyGifs({ searchTerm: 'party' });
    expect(result).toEqual([{ id: 2 }]);
    expect(callCount).toBe(2);
  });
});

describe('registerKlipyGifShare', () => {
  let originalFetch;
  let originalKey;

  beforeEach(() => {
    originalFetch = globalThis.fetch;
    originalKey = process.env.KLIPY_API_KEY;
    process.env.KLIPY_API_KEY = 'test-key';
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    process.env.KLIPY_API_KEY = originalKey;
  });

  it('POSTs the share with the gif id and search term', async () => {
    let capturedConfig;
    globalThis.fetch = async (url, config) => {
      capturedConfig = config;
      return { ok: true, status: 200, json: async () => ({ ok: true }) };
    };
    await registerKlipyGifShare({ id: 'gif-123' }, 'party parrot');
    expect(capturedConfig.method).toBe('POST');
    expect(capturedConfig.body).toEqual({
      customer_id: 'put-a-bot-on-it-discord-server',
      q: 'party parrot',
    });
  });
});

describe('getRandomGifByTerm', () => {
  let originalFetch;

  beforeEach(() => {
    originalFetch = globalThis.fetch;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  const gif = {
    file: {
      md: { gif: { url: 'md-url' } },
      hd: { gif: { url: 'hd-url' } },
    },
  };

  it('returns the hd gif url by default', async () => {
    globalThis.fetch = async () => ({
      ok: true,
      status: 200,
      json: async () => ({ data: { data: [gif] } }),
    });
    expect(await getRandomGifByTerm('test')).toBe('hd-url');
  });

  it('returns the md gif url when useDownsized is true', async () => {
    globalThis.fetch = async () => ({
      ok: true,
      status: 200,
      json: async () => ({ data: { data: [gif] } }),
    });
    expect(await getRandomGifByTerm('test', true)).toBe('md-url');
  });
});

describe('prepareEmbed', () => {
  it('returns an embed with no fields set when called without arguments', () => {
    const embed = prepareEmbed();
    expect(embed.data.title).toBeUndefined();
    expect(embed.data.color).toBeUndefined();
    expect(embed.data.description).toBeUndefined();
    expect(embed.data.author).toBeUndefined();
  });

  it('sets all provided fields on the embed', () => {
    const embed = prepareEmbed({
      embedAuthor: { name: 'BirdBot' },
      embedTitle: 'Hello',
      embedDescription: 'World',
      embedThumbnail: 'https://example.com/thumb.png',
      embedImage: 'https://example.com/image.png',
      embedColor: '#ff0000',
      embedUrl: 'https://example.com',
      embedFooter: 'Made with love',
    });
    expect(embed.data.author).toEqual({ name: 'BirdBot' });
    expect(embed.data.title).toBe('Hello');
    expect(embed.data.description).toBe('World');
    expect(embed.data.thumbnail).toEqual({
      url: 'https://example.com/thumb.png',
    });
    expect(embed.data.image).toEqual({ url: 'https://example.com/image.png' });
    expect(embed.data.color).toBe(0xff0000);
    expect(embed.data.url).toBe('https://example.com');
    expect(embed.data.footer).toEqual({ text: 'Made with love' });
  });
});

describe('sendContent', () => {
  const makeInteraction = () => ({
    reply: async () => {},
    editReply: async () => {},
    fetchReply: async () => ({ react: async () => {}, delete: async () => {} }),
  });

  it('replies when not deferred', async () => {
    let args;
    const interaction = makeInteraction();
    interaction.reply = async (a) => {
      args = a;
    };
    await sendContent({ interaction, content: 'hi' });
    expect(args.content).toBe('hi');
    expect(args.flags).toBeUndefined();
  });

  it('edits the reply when deferred', async () => {
    let args;
    const interaction = makeInteraction();
    interaction.editReply = async (a) => {
      args = a;
    };
    await sendContent({ interaction, content: 'hi', deferred: true });
    expect(args.content).toBe('hi');
  });

  it('sets the ephemeral flag when requested', async () => {
    let args;
    const interaction = makeInteraction();
    interaction.reply = async (a) => {
      args = a;
    };
    await sendContent({ interaction, content: 'hi', ephemeral: true });
    expect(args.flags).toBe(MessageFlags.Ephemeral);
  });

  it('reacts when a reaction is provided', async () => {
    let reacted;
    const interaction = makeInteraction();
    interaction.fetchReply = async () => ({
      react: async (emoji) => {
        reacted = emoji;
      },
      delete: async () => {},
    });
    await sendContent({ interaction, content: 'hi', reaction: '👍' });
    expect(reacted).toBe('👍');
  });
});

describe('sendEmbed', () => {
  it('replies with an embed and file when not deferred', async () => {
    let args;
    const interaction = {
      reply: async (a) => {
        args = a;
      },
      editReply: async () => {},
      fetchReply: async () => ({ react: async () => {} }),
    };
    const embed = { title: 'hi' };
    const file = { name: 'file.png' };
    await sendEmbed({ interaction, content: embed, file, deferred: false });
    expect(args.embeds).toEqual([embed]);
    expect(args.files).toEqual([file]);
  });

  it('reacts with each emoji when the reaction is an array', async () => {
    const reacted = [];
    const interaction = {
      reply: async () => {},
      editReply: async () => {},
      fetchReply: async () => ({
        react: async (emoji) => {
          reacted.push(emoji);
        },
      }),
    };
    await sendEmbed({
      interaction,
      content: { title: 'x' },
      reaction: ['👍', '🔥'],
    });
    expect(reacted).toEqual(['👍', '🔥']);
  });
});

describe('generateImageAttachment', () => {
  it('returns an embed file and image URL for a generated image', async () => {
    const openai = {
      images: {
        generate: async () => ({
          data: [{ b64_json: 'aGVsbG8=' }],
        }),
      },
    };
    const { embedFile, embedImage } = await generateImageAttachment({
      openai,
      prompt: 'test prompt',
      userId: 'user-123',
    });
    expect(embedImage).toMatch(/^attachment:\/\/.*\.png$/);
    expect(embedFile.name).toMatch(/\.png$/);
  });

  it('passes extra options to the generate call', async () => {
    let capturedArgs;
    const openai = {
      images: {
        generate: async (args) => {
          capturedArgs = args;
          return { data: [{ b64_json: 'aGVsbG8=' }] };
        },
      },
    };
    await generateImageAttachment({
      openai,
      prompt: 'test prompt',
      userId: 'user-123',
      options: { moderation: 'low', quality: 'auto' },
    });
    expect(capturedArgs.prompt).toBe('test prompt');
    expect(capturedArgs.user).toBe('user-123');
    expect(capturedArgs.moderation).toBe('low');
    expect(capturedArgs.quality).toBe('auto');
  });
});

describe('wait', () => {
  it('resolves after the given delay', async () => {
    const start = Date.now();
    await wait(20);
    expect(Date.now() - start).toBeGreaterThanOrEqual(20);
  });
});
