import { AttachmentBuilder, SlashCommandBuilder } from 'discord.js';
import OpenAI from 'openai';
import { v4 as uuidv4 } from 'uuid';
import { MastraClient } from '@mastra/client-js';

import {
  birdLog,
  getRandomColor,
  prepareEmbed,
  sendEmbed,
} from '../lib/helpers.js';
import { gptGetEmoji } from '../lib/openai.js';

const { OPEN_AI_API_KEY } = process.env;

const openai = new OpenAI({
  apiKey: OPEN_AI_API_KEY,
});

const mastra = new MastraClient({
  baseUrl: "http://localhost:4111",
});

const agent = mastra.getAgent('weatherAgent');

export default {
  data: new SlashCommandBuilder()
    .setName('weather')
    .setDescription(
      `Get's the current weather for a specified city or zip code`
    )
    .addStringOption((option) =>
      option
        .setName('location')
        .setDescription('Provide a city name or zip code for the weather')
        .setRequired(true)
    ),
  async execute(interaction) {
    await interaction.deferReply();

    const location = interaction.options.getString('location');

    birdLog(`[/weather] location input as: ${location}`);

    const weatherInfo = await agent.generate({
      messages: [
        {
          role: 'user',
          content: `What is the weather in ${location}`,
        },
      ],
    })

    birdLog(`[/weather] weather info: ${weatherInfo.text}`);

    let aiImageName = null;
    let embedFile = null;
    let embedImage = '';

    const imagePrompt = `Generate a realistic image of the location requested using the weather information provided.

    <location> ${location} </location>

    <weather> ${weatherInfo.text} </weather>

    The image should have text with the date and time at the top (left-aligned) and some key weather info like temp and conditions at the bottom (right-aligned). The image should be realistic and not cartoonish. The image should be a square format. The image should be in the style of a weather app. The image should be in color. The image should be in 1024x1024 resolution. The image should be in PNG format. The image should be in a realistic style. The image should not have any text other than the date and time and the weather info.`;

    try {
      const imageResponse = await openai.images.generate({
        prompt: imagePrompt,
        n: 1,
        size: '1024x1024',
        model: 'gpt-image-1',
        user: interaction.user.id,
      });
      const aiImage = imageResponse.data[0].b64_json;
      aiImageName = `${uuidv4()}.png`;
      embedImage = `attachment://${aiImageName}`;
      embedFile = new AttachmentBuilder(Buffer.from(aiImage, 'base64'), { name: aiImageName });
    } catch (error) {
      birdLog(`[/weather] image generation failed for prompt: ${imagePrompt}`);
    }

    const emojiJson = await gptGetEmoji({
      textToAnalyze: weatherInfo.text,
      openAiClient: openai,
    });
    // birdLog('[/weather]', emojiJson);

    const weatherEmbed = prepareEmbed({
      embedColor: getRandomColor(),
      embedDescription: weatherInfo.text,
      embedImage,
    });

    return await sendEmbed({
      interaction,
      content: weatherEmbed,
      file: embedFile,
      reaction: emojiJson.map((item) => item.emoji),
      deferred: true,
    });
  },
};
