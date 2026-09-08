import { stripIndents } from 'common-tags';
import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import OpenAI from 'openai';

import {
  birdLog,
  generateImageAttachment,
  getRandomColor,
  prepareEmbed,
  sendEmbed,
} from '../lib/helpers.ts';
import { gptGetEmoji } from '../lib/openai.ts';

const { OPENAI_API_KEY } = process.env;

export default {
  data: new SlashCommandBuilder()
    .setName('news')
    .setDescription(
      'Bird Bot (GPT powered web search) returns some of the latest headlines.'
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    const openai = new OpenAI({
      apiKey: OPENAI_API_KEY!,
    });

    const randomColor = getRandomColor();

    const systemPrompt = stripIndents`
      You are a robotic bird that's an AI assistant for gathering and returning current news articles:
      <personalityTraits>
      - Your name is Bird Bot, you are very helpful and also very sarcastic.
      - Your responses should include relevant information and you should also be a bit of a jerk.
      - Your responses should have some personality, be a bit snarky, occasionally rude, include emojis, and feature bird related puns when summarizing the news.
      - You should also keep the responses as short as possible.
      - You should use unbiased news sources like Reuters and The AP.
      - Do NOT use CNN.com or CNN as a news source.
      </personalityTraits>
    `;

    const textResponse = await openai.responses.create({
      model: 'gpt-5.5',
      tools: [{ type: 'web_search' }],
      input: [
        {
          role: 'developer',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: `What are four top news stories today? Don't use CNN.com or CNN as a source.`,
        },
      ],
      user: interaction.user.id,
    });

    // console.log(textPrompt);
    // console.log(textResponse.output_text);
    birdLog(`[/news] ${textResponse.output_text}`);

    const emojiJson = await gptGetEmoji({
      textToAnalyze: textResponse.output_text,
      openAiClient: openai,
    });

    const imagePromptResponse = await openai.responses.create({
      model: 'gpt-5.6-luna',
      input: [
        {
          role: 'system',
          content: stripIndents`
            You're a helpful AI assistant that generates prompts to feed to GPT-Image for images
            that represent collections of news articles. You should reply with a prompt that describes
            the image you want GPT-Image to generate:
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
      user: interaction.user.id,
    });

    const imagePrompt = imagePromptResponse.output_text
      .replace('Prompt for GPT-Image:', '')
      .trim();

    birdLog(`[/news (imagePrompt)] ${imagePrompt}`);
    const { embedFile, embedImage } = await generateImageAttachment({
      openai,
      prompt: imagePrompt,
      userId: interaction.user.id,
    });

    const newsEmbed = prepareEmbed({
      embedTitle: 'Bird Bot News',
      embedColor: randomColor,
      embedDescription: textResponse.output_text,
      embedImage,
    });

    return await sendEmbed({
      interaction,
      content: newsEmbed,
      file: embedFile,
      reaction: emojiJson.map((item) => item.emoji),
    });
  },
};
