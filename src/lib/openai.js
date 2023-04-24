import { birdLog } from '../lib/helpers.js';

// import { Configuration, OpenAIApi } from 'openai';

// const { OPEN_AI_API_KEY } = process.env;

// const configuration = new Configuration({
//   apiKey: OPEN_AI_API_KEY,
// });

// const openai = new OpenAIApi(configuration);

export const gptGetHaiku = async (
  subjectText,
  openAiClient,
  interaction = null,
) => {
  const haikuPrompt = `Generate a haiku about the subject: ${subjectText}`;

  const haikuResponse = await openAiClient.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'assistant',
        content: haikuPrompt,
      },
    ],
    temperature: 0.2,
    user: interaction.user.id,
  });

  const haiku = haikuResponse.data.choices[0].message.content;

  return haiku;
};

export const gptGetLimerick = async (
  subjectText,
  openAiClient,
  interaction = null,
) => {
  const limerickPrompt = `Generate a limerick about the subject: ${subjectText}`;

  const limerickResponse = await openAiClient.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'assistant',
        content: limerickPrompt,
      },
    ],
    temperature: 0.2,
    user: interaction.user.id,
  });

  const limerick = limerickResponse.data.choices[0].message.content;

  return limerick;
};

export const gptGetEmoji = async (
  textToAnalyze,
  openAiClient,
  interaction = null,
) => {
  let emojiJson = [
    {
      emoji: '😞',
      short_code: ':disappointed_face:',
      reasoning: 'There was an error with the request.',
    },
  ];
  try {
    const emojiPrompt = `
      Analyze the following text and provide at least 1 emojis from unicode 
      v15 in order of relevance, and their markdown short codes, that best 
      represent it as JSON with keys for emoji, short code, and reasoning. 
      Only return the resulting JSON array of objects: ${textToAnalyze.trim()}
    `;

    const emojiResponse = await openAiClient.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'assistant',
          content: emojiPrompt.trim(),
        },
      ],
      temperature: 0.3,
      user: interaction.user.id,
    });

    birdLog(`[gptGetEmoji] ${emojiResponse.data.choices[0].message.content}`);

    let content = emojiResponse.data.choices[0].message.content.trim();

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
