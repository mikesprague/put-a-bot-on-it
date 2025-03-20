import { stripIndents } from 'common-tags';
import { AttachmentBuilder, SlashCommandBuilder } from 'discord.js';
import OpenAI from 'openai';
import { v4 as uuidv4 } from 'uuid';

import {
  birdLog,
  getRandomColor,
  prepareEmbed,
  sendEmbed,
} from '../lib/helpers.js';
import { gptGetEmoji } from '../lib/openai.js';

const { OPEN_AI_API_KEY } = process.env;

export default {
  data: new SlashCommandBuilder()
    .setName('news')
    .setDescription(
      'Bird Bot (GPT-4o powered web search) returns some of the latest headlines.'
    ),
  async execute(interaction) {
    await interaction.deferReply();

    const openai = new OpenAI({
      apiKey: OPEN_AI_API_KEY,
    });

    const randomColor = getRandomColor();

    const systemPrompt = stripIndents`
      You are a robotic bird that's an AI assistant for gathering and returning current news articles:
      <personalityTraits>
      - Your name is Bird Bot, you are very helpful and also very sarcastic.
      - Your responses should include relevant information and you should also be a bit of a jerk.
      - Your responses should have some personality, be a bit snarky, occasionally rude, include emojis, and feature bird related puns when summarizing the news.
      - You should also keep the responses as short as possible.
      - You should try and use news sources other than CNN.
      </personalityTraits>
    `;

    const textResponse = await openai.responses.create({
      model: 'gpt-4o-mini',
      tools: [{ type: 'web_search_preview' }],
      input: [
        {
          role: 'developer',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: 'What are four top news stories today?',
        },
      ],
      temperature: 0,
      user: interaction.user.id,
    });

    // console.log(textPrompt);
    // console.log(textResponse.output_text);
    birdLog(`[/news] ${textResponse.output_text}`);

    const emojiJson = await gptGetEmoji({
      textToAnalyze: textResponse.output_text,
      openAiClient: openai,
    });

    let imagePrompt = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: stripIndents`
            You're a helpful AI assistant that generates prompts to feed to DALL-E for images
            that represent collections of news articles. You should reply with a prompt that describes
            the image you want DALL-E to generate:
              - Images should be photo realistic
              - Images should not contain any text
              - Return only the text for image prompt
            `,
        },
        {
          role: 'user',
          content: textResponse.output_text,
        },
      ],
      temperature: 0,
      user: interaction.user.id,
    });

    imagePrompt = imagePrompt?.choices[0]?.message?.content
      .replace('Prompt for DALL-E:', '')
      .trim();

    birdLog(`[/news (imagePrompt)] ${imagePrompt}`);
    const imageResponse = await openai.images.generate({
      prompt: imagePrompt,
      n: 1,
      size: '1024x1024',
      user: interaction.user.id,
      model: 'dall-e-3',
    });
    const aiImage = imageResponse.data[0].url;
    const aiImageName = `${uuidv4()}.png`;

    const embedFile = new AttachmentBuilder(aiImage, { name: aiImageName });

    const newsEmbed = prepareEmbed({
      embedTitle: 'Bird Bot News',
      embedColor: randomColor,
      embedDescription: textResponse.output_text,
      embedImage: `attachment://${aiImageName}`,
    });

    return await sendEmbed({
      interaction,
      content: newsEmbed,
      file: embedFile,
      reaction: emojiJson.map((item) => item.emoji),
    });
  },
};
