import { randomUUID } from 'node:crypto';

import { oneLineTrim, stripIndents } from 'common-tags';
import type OpenAI from 'openai';

import { birdLog } from '../lib/helpers.ts';

export const gptAnalyzeText = async ({
  systemPrompt,
  textToAnalyze,
  openAiClient,
  model = 'gpt-5.6-luna',
  user = randomUUID(),
}: {
  systemPrompt: string;
  textToAnalyze: string;
  openAiClient: OpenAI;
  model?: string;
  user?: string;
}): Promise<string> => {
  const gptResponse = await openAiClient.responses.create({
    model,
    input: [
      {
        role: 'system',
        content: systemPrompt.trim(),
      },
      {
        role: 'user',
        content: textToAnalyze.trim(),
      },
    ],
    user,
  });

  return gptResponse.output_text;
};

export const gptGetHaiku = async ({
  textToAnalyze,
  openAiClient,
  model = 'gpt-5.6-luna',
  user = randomUUID(),
}: {
  textToAnalyze: string;
  openAiClient: OpenAI;
  model?: string;
  user?: string;
}): Promise<string> => {
  const systemPrompt = oneLineTrim`
    You are an AI haiku generator. You should return one
    haiku about whatever topics you are given by users.
  `;
  const haiku = await gptAnalyzeText({
    systemPrompt,
    textToAnalyze,
    openAiClient,
    model,
    user,
  });

  // console.log(haiku);

  return haiku;
};

export const gptGetLimerick = async ({
  textToAnalyze,
  openAiClient,
  model = 'gpt-5.6-luna',
  user = randomUUID(),
}: {
  textToAnalyze: string;
  openAiClient: OpenAI;
  model?: string;
  user?: string;
}): Promise<string> => {
  const systemPrompt = oneLineTrim`
    You are an AI limerick generator. You should return one limerick
    about whatever topics you are given by users.
  `;
  const limerick = await gptAnalyzeText({
    systemPrompt,
    textToAnalyze,
    openAiClient,
    model,
    user,
  });

  // console.log(limerick);

  return limerick;
};

export const gptGetEmoji = async ({
  textToAnalyze,
  openAiClient,
  user = randomUUID(),
}: {
  textToAnalyze: string;
  openAiClient: OpenAI;
  user?: string;
}): Promise<Array<{ emoji: string; shortCode: string; reason: string }>> => {
  const resultsShape = [
    {
      emoji: '',
      shortCode: '',
      reason: '',
    },
  ];

  let emojiJson: Array<{ emoji: string; shortCode: string; reason: string }> = [
    {
      emoji: '😞',
      shortCode: ':disappointed_face:',
      reason: 'There was an error with the request.',
    },
  ];
  try {
    const prompt = stripIndents`
      Analyze the supplied text and return a JSON array of objects containing unique
      unicode v15 emojis that best represent it. Each object in the array should contain
      the emoji, the markdown short code for the emoji, and the reasoning for choosing it.
      Don't return any duplicate emojis.

      JSON response should have a shape of: ${JSON.stringify(resultsShape)}
    `;

    const emojiResponse = await openAiClient.responses.create({
      input: [
        {
          role: 'system',
          content: prompt,
        },
        {
          role: 'user',
          content: textToAnalyze,
        },
      ],
      max_output_tokens: 1000,
      model: 'gpt-5.6-luna',
      user,
    });

    let content = emojiResponse.output_text.trim();
    // console.log(content);

    if (content.includes('inappropriate') && content.includes('offensive')) {
      emojiJson = [
        {
          emoji: '🙈',
          shortCode: ':see_no_evil_monkey:',
          reason: 'There was inappropriate content in the request.',
        },
        {
          emoji: '🙉',
          shortCode: ':hear_no_evil_monkey',
          reason: 'There was inappropriate content in the request.',
        },
        {
          emoji: '🙊',
          shortCode: ':speak_no_evil_monkey:',
          reason: 'There was inappropriate content in the request.',
        },
      ];
    } else {
      const match = content.match(/\[[\s\S]*\]/);
      content = match ? match[0].trim() : '[]';
      birdLog(`[gptGetEmoji] ${content}`);
      emojiJson = JSON.parse(content);
    }
  } catch (error) {
    console.log(error);
  }
  return emojiJson;
};
