import { oneLineTrim, stripIndents } from 'common-tags';
import { v4 as uuidv4 } from 'uuid';

import { birdLog } from '../lib/helpers.js';

export const gptAnalyzeText = async ({
  systemPrompt,
  textToAnalyze,
  openAiClient,
  model = 'gpt-3.5-turbo',
  temperature = 0.2,
  user = uuidv4(),
}) => {
  const gptResponse = await openAiClient.createChatCompletion({
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

  return gptResponse.data.choices;
};

export const gptGetHaiku = async ({
  textToAnalyze,
  openAiClient,
  model = 'gpt-3.5-turbo',
  temperature = 0.2,
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
  model = 'gpt-3.5-turbo',
  temperature = 0.2,
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
  let emojiJson = [
    {
      emoji: '😞',
      short_code: ':disappointed_face:',
      reasoning: 'There was an error with the request.',
    },
  ];
  try {
    const prompt = stripIndents`
      Analyze the following text and return a JSON array of objects containing unique 
      unicode v15 emojis that best represent it. Each object in the array should contain 
      the emoji, the markdown short code for the emoji, and the reasoning for choosing it. 
      Don't return any duplicate emojis.

      Analyze the following text and return only the JSON array of objects:

      ${textToAnalyze}
    `;

    const emojiResponse = await openAiClient.createCompletion({
      prompt,
      temperature: 0.2,
      max_tokens: 1000,
      model: 'text-davinci-003',
      user,
    });

    let content = emojiResponse.data.choices[0].text.trim();
    // console.log(content);

    if (content.includes('inappropriate') && content.includes('offensive')) {
      emojiJson = [
        {
          emoji: '🙈',
          short_code: ':see_no_evil_monkey:',
          reasoning: 'There was inappropriate content in the request.',
        },
        {
          emoji: '🙉',
          short_code: ':hear_no_evil_monkey',
          reasoning: 'There was inappropriate content in the request.',
        },
        {
          emoji: '🙊',
          short_code: ':speak_no_evil_monkey:',
          reasoning: 'There was inappropriate content in the request.',
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
