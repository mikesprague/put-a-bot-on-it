import { describe, it, expect } from 'bun:test';

import type OpenAI from 'openai';

import {
  gptAnalyzeText,
  gptGetEmoji,
  gptGetHaiku,
  gptGetLimerick,
} from './openai.ts';

const makeClient = (outputText: string) =>
  ({
    responses: {
      create: async () => ({ output_text: outputText }),
    },
  }) as unknown as OpenAI;

describe('gptAnalyzeText', () => {
  it('returns the output text from the response', async () => {
    const openAiClient = makeClient('analyzed result');
    const result = await gptAnalyzeText({
      systemPrompt: 'system',
      textToAnalyze: 'text',
      openAiClient,
    });
    expect(result).toBe('analyzed result');
  });

  it('trims the input and passes through options', async () => {
    let captured!: { input: unknown; model: unknown; user: unknown };
    const openAiClient = {
      responses: {
        create: async (args: {
          input: unknown;
          model: unknown;
          user: unknown;
        }) => {
          captured = args;
          return { output_text: 'result' };
        },
      },
    } as unknown as OpenAI;
    await gptAnalyzeText({
      systemPrompt: '  sys  ',
      textToAnalyze: '  text  ',
      openAiClient,
      model: 'gpt-4',
      user: 'user-1',
    });
    expect(captured.input).toEqual([
      { role: 'system', content: 'sys' },
      { role: 'user', content: 'text' },
    ]);
    expect(captured.model).toBe('gpt-4');
    expect(captured.user).toBe('user-1');
  });
});

describe('gptGetHaiku', () => {
  it('returns the generated haiku text', async () => {
    const openAiClient = makeClient('a haiku');
    const haiku = await gptGetHaiku({
      textToAnalyze: 'topic',
      openAiClient,
    });
    expect(haiku).toBe('a haiku');
  });
});

describe('gptGetLimerick', () => {
  it('returns the generated limerick text', async () => {
    const openAiClient = makeClient('a limerick');
    const limerick = await gptGetLimerick({
      textToAnalyze: 'topic',
      openAiClient,
    });
    expect(limerick).toBe('a limerick');
  });
});

describe('gptGetEmoji', () => {
  it('parses a JSON array of emoji from the response', async () => {
    const openAiClient = makeClient(
      '[{"emoji":"😀","shortCode":":grinning:","reason":"happy"}]'
    );
    const result = await gptGetEmoji({
      textToAnalyze: 'happy',
      openAiClient,
      user: 'user-1',
    });
    expect(result).toEqual([
      { emoji: '😀', shortCode: ':grinning:', reason: 'happy' },
    ]);
  });

  it('parses a JSON array wrapped in markdown fences', async () => {
    const openAiClient = makeClient(
      '```json\n[{"emoji":"😀","shortCode":":grinning:","reason":"happy"}]\n```'
    );
    const result = await gptGetEmoji({
      textToAnalyze: 'happy',
      openAiClient,
    });
    expect(result).toEqual([
      { emoji: '😀', shortCode: ':grinning:', reason: 'happy' },
    ]);
  });

  it('returns see-no-evil emojis for inappropriate content', async () => {
    const openAiClient = makeClient('inappropriate and offensive content');
    const result = await gptGetEmoji({
      textToAnalyze: 'bad',
      openAiClient,
    });
    expect(result.map((item) => item.emoji)).toEqual(['🙈', '🙉', '🙊']);
  });

  it('returns a default emoji when the request errors', async () => {
    const originalLog = console.log;
    console.log = () => {};
    try {
      const openAiClient = {
        responses: {
          create: async () => {
            throw new Error('boom');
          },
        },
      } as unknown as OpenAI;
      const result = await gptGetEmoji({
        textToAnalyze: 'anything',
        openAiClient,
      });
      expect(result).toEqual([
        {
          emoji: '😞',
          shortCode: ':disappointed_face:',
          reason: 'There was an error with the request.',
        },
      ]);
    } finally {
      console.log = originalLog;
    }
  });
});
