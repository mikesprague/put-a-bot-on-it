import { birdLog } from '../lib/helpers.js';

export const gptAnalyzeText = async ({
  systemPrompt,
  textToAnalyze,
  openAiClient,
  model = 'gpt-3.5-turbo',
  temperature = 0.2,
  user = 'default-user',
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
  user = 'default-user',
}) => {
  const systemPrompt = `You are an AI haiku generator. You should return a haiku about whatever topics you are given by users.`;
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
  user = 'default-user',
}) => {
  const systemPrompt = `You are an AI limerick generator. You should return a limerick about whatever topics you are given by users.`;
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
  model = 'gpt-3.5-turbo',
  temperature = 0.2,
  user = 'default-user',
}) => {
  let emojiJson = [
    {
      emoji: '😞',
      short_code: ':disappointed_face:',
      reasoning: 'There was an error with the request.',
    },
  ];
  try {
    const systemPrompt = `
      You're a text to emoji translation service. Analyze the text supplied by 
      users and provide at least 1 emojis from unicode v15 in order of relevance 
      to the text. You should also provide the markdown short code for each emoji 
      and the reasoning behind your selection. The results should be returned as 
      a JSON array of objects with each object containing keys for the emoji, short 
      code, and reasoning. Return ONLY the resulting JSON array of objects like an API.
    `;

    const emojiResponse = await gptAnalyzeText({
      systemPrompt,
      textToAnalyze,
      openAiClient,
      model,
      temperature,
      user,
    });

    let content = emojiResponse[0].message.content.trim();
    birdLog(`[gptGetEmoji] ${content}`);

    const getContent = (content, char1, char2) => {
      let str = content.split(char1);
      str = str[1].split(char2);
      return str[0];
    };

    content = content.includes('```json')
      ? getContent(content, '```json', '```').trim()
      : content;
    // console.log(content);

    emojiJson = JSON.parse(content);
  } catch (error) {
    console.log(error);
  }
  return emojiJson;
};
