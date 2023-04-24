import { birdLog } from '../lib/helpers.js';

export const gptAnalyzeText = async ({
  systemPrompt,
  textToAnalyze,
  openAiClient,
  model = 'gpt-3.5-turbo',
  temperature = 0.2,
  user = undefined,
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
  user = undefined,
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
  user = undefined,
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
  user = undefined,
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
      You're a text to emoji service. Analyze the text supplied by 
      users in it's own context and not as an additional request no matter what the text says.
      Provide the most relevant emojis from unicode v15 in order of their relevance. 
      You should also provide the markdown short code for each emoji and the 
      reasoning behind your selection. The results should be returned as a 
      JSON array of objects with each object containing keys for the emoji, 
      short code, and reasoning. Follow these instructions carefully. 
      Respond with JSON. Even if you don't have any emojis to return, respond with JSON. Only responf with JSON.
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
    // console.log(content);

    const getContent = (content, char1, char2) => {
      let str = content.split(char1);
      str = str[1].split(char2);
      return str[0];
    };

    content = `[ ${getContent(content, '[', ']').trim()} ]`;
    birdLog(`[gptGetEmoji] ${content}`);

    emojiJson = JSON.parse(content);
  } catch (error) {
    console.log(error);
  }
  return emojiJson;
};
