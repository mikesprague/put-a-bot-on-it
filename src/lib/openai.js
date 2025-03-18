import { oneLineTrim, stripIndents } from 'common-tags';
import { v4 as uuidv4 } from 'uuid';

import { birdLog } from '../lib/helpers.js';

export const gptAnalyzeText = async ({
  systemPrompt,
  textToAnalyze,
  openAiClient,
  model = 'gpt-4.5-preview',
  temperature = 0.1,
  user = uuidv4(),
}) => {
  const gptResponse = await openAiClient.chat.completions.create({
    model,
    messages: [
      {
        role: 'system',
        content: systemPrompt.trim(),
      },
      {
        role: 'user',
        content: textToAnalyze.trim(),
      },
    ],
    temperature,
    user,
  });

  return gptResponse.choices;
};

export const gptGetHaiku = async ({
  textToAnalyze,
  openAiClient,
  model = 'gpt-4.5-preview',
  temperature = 0.1,
  user = uuidv4(),
}) => {
  const systemPrompt = oneLineTrim`
    You are an AI haiku generator. You should return one
    haiku about whatever topics you are given by users.
  `;
  const haikuResponse = await gptAnalyzeText({
    systemPrompt,
    textToAnalyze,
    openAiClient,
    model,
    temperature,
    user,
  });

  const haiku = haikuResponse[0].message.content;
  // console.log(haiku);

  return haiku;
};

export const gptGetLimerick = async ({
  textToAnalyze,
  openAiClient,
  model = 'gpt-4.5-preview',
  temperature = 0.1,
  user = uuidv4(),
}) => {
  const systemPrompt = oneLineTrim`
    You are an AI limerick generator. You should return one limerick
    about whatever topics you are given by users.
  `;
  const limerickResponse = await gptAnalyzeText({
    systemPrompt,
    textToAnalyze,
    openAiClient,
    model,
    temperature,
    user,
  });

  const limerick = limerickResponse[0].message.content;
  // console.log(limerick);

  return limerick;
};

export const gptGetEmoji = async ({
  textToAnalyze,
  openAiClient,
  user = uuidv4(),
}) => {
  const resultsShape = [
    {
      emoji: '',
      shortCode: '',
      reason: '',
    },
  ];

  let emojiJson = [
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

      Text to analyze: ${textToAnalyze}
    `;

    const emojiResponse = await openAiClient.completions.create({
      prompt,
      temperature: 0.1,
      max_tokens: 1000,
      model: 'gpt-4o',
      user,
    });

    let content = emojiResponse.choices[0].text.trim();
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
      const getContent = (content, char1, char2) => {
        let str = content.split(char1);
        str = str[1].split(char2);
        return str[0];
      };

      content = `[ ${getContent(content, '[', ']').trim()} ]`;
      birdLog(`[gptGetEmoji] ${content}`);
      emojiJson = JSON.parse(content);
    }
  } catch (error) {
    console.log(error);
  }
  return emojiJson;
};
