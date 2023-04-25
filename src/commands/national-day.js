import { Configuration, OpenAIApi } from 'openai';
import { AttachmentBuilder, SlashCommandBuilder } from 'discord.js';
import { v4 as uuidv4 } from 'uuid';

import {
  // getTenorGifs,
  getRandomNum,
  getRandomColor,
  prepareEmbed,
  sendEmbed,
  birdLog,
} from '../lib/helpers.js';
import { gptGetEmoji, gptGetHaiku } from '../lib/openai.js';
import { initNationalDayData } from '../lib/national-day.js';

const { OPEN_AI_API_KEY } = process.env;

export default {
  data: new SlashCommandBuilder()
    .setName('national-day')
    .setDescription(
      'Random day from National Day Calendar (w/ possibly related AI-generated image)',
    ),
  async execute(interaction) {
    await interaction.deferReply();

    const configuration = new Configuration({
      apiKey: OPEN_AI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    const randomColor = getRandomColor();

    const nationalDayData = await initNationalDayData();

    const randomNum = getRandomNum(nationalDayData.length);
    const { title, description, link } = nationalDayData[randomNum];

    birdLog('[/national-day]', title);

    const textResponse = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are an AI assistant set up to specifically to extract the topics and subjects from text input by your users. You should reply with a short but descriptive paragraph of 3 sentences or less and try to avoid general words like "celebration", "day", "week", "month", "national", or "international" and stick to describing the topics and/or subjects. Do not mention the specific occasion, just describe it.`,
        },
        {
          role: 'user',
          content: description,
        },
      ],
      temperature: 0.3,
      // user: interaction.user.id,
    });

    // console.log(textPrompt);
    // console.log(textResponse.data.choices[0].message.content);
    const aiSummary = textResponse.data.choices[0].message.content;
    birdLog(`[/national-day] ${aiSummary}`);

    const emojiJson = await gptGetEmoji({
      textToAnalyze: aiSummary,
      openAiClient: openai,
    });

    const imagePrompt = `action shot of ${aiSummary}, photo, detailed image`;
    const imageResponse = await openai.createImage({
      prompt: imagePrompt,
      n: 1,
      size: '1024x1024',
    });
    const aiImage = imageResponse.data.data[0].url;
    const aiImageName = `${uuidv4()}.png`;

    const embedFile = new AttachmentBuilder(aiImage, { name: aiImageName });

    // birdLog(`[/national-day] ${aiImage}`);

    const haiku = await gptGetHaiku({
      textToAnalyze: aiSummary,
      openAiClient: openai,
    });

    const nationalDayEmbed = prepareEmbed({
      embedTitle: title,
      embedColor: randomColor,
      embedDescription: `${description} [Read More](${link})\n\n**Haiku**\n${haiku}`,
      embedImage: `attachment://${aiImageName}`,
      embedUrl: link,
    });
    birdLog(`[/national-day] ${title}`);
    return await sendEmbed({
      interaction,
      content: nationalDayEmbed,
      file: embedFile,
      reaction: emojiJson.map((item) => item.emoji),
    });
  },
};
