import { stripIndents } from 'common-tags';
import { AttachmentBuilder, SlashCommandBuilder } from 'discord.js';
import OpenAI from 'openai';
import { v4 as uuidv4 } from 'uuid';

import {
  birdLog,
  getRandomColor,
  getRandomNum,
  // getKlipyGifs,
  prepareEmbed,
  sendEmbed,
} from '../lib/helpers.js';
import { initNationalDayData } from '../lib/national-day.js';
import { gptGetEmoji } from '../lib/openai.js';

const { OPEN_AI_API_KEY } = process.env;

export default {
  data: new SlashCommandBuilder()
    .setName('national-day')
    .setDescription(
      'Random day from National Day Calendar (w/ possibly related AI-generated image)'
    ),
  async execute(interaction) {
    await interaction.deferReply();

    const openai = new OpenAI({
      apiKey: OPEN_AI_API_KEY,
    });

    const randomColor = getRandomColor();

    const nationalDayData = await initNationalDayData();

    const randomNum = getRandomNum(nationalDayData.length);
    const { title, description, link } = nationalDayData[randomNum];

    birdLog(`[/national-day] ${title}`);

    const systemPrompt = stripIndents`
      You are an AI assistant set up to specifically to extract the topics and
      subjects from text input by your users.
      - You should reply with a short but descriptive paragraph of 3 sentences or less
      - You should avoid general words like "celebration", "day", "week", "month", "national", or "international"
      - You should describe the topics and/or subjects only do NOT mention the specific occasion
    `;

    const textResponse = await openai.responses.create({
      model: 'gpt-5.1-chat-latest',
      input: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content:
            description
              .toLowerCase()
              .includes('always more going on every month') ||
            description
              .toLowerCase()
              .includes('check out these videos for some extra inspiration')
              ? title
              : description,
        },
      ],
      user: interaction.user.id,
    });

    // console.log(textPrompt);
    // console.log(textResponse.choices[0].message.content);
    const aiSummary = textResponse.output_text.trim();
    birdLog(`[/national-day (aiSummary)] ${aiSummary}`);

    const emojiJson = await gptGetEmoji({
      textToAnalyze: aiSummary,
      openAiClient: openai,
    });

    let imagePrompt = await openai.responses.create({
      model: 'gpt-5.1-chat-latest',
      input: [
        {
          role: 'system',
          content: stripIndents`
            You're a helpful AI assistant that generates prompts to feed to GPT-Image for images
            that represent various National Days. You will be provided with the name of a National Day.
            You should reply with a prompt that describes the image for GPT-Image to generate:
              - Images should be photo realistic
              - Images should not contain any text
              - Return only the text for image prompt
            `,
        },
        {
          role: 'user',
          content: title,
        },
      ],
      user: interaction.user.id,
    });

    imagePrompt = imagePrompt?.output_text
      .replace('Prompt for GPT-Image:', '')
      .trim();

    // const imagePrompt = `action shot of ${aiSummary}, photo, extremely detailed, perfect composition, no words`;
    birdLog(`[/national-day (imagePrompt)] ${imagePrompt}`);
    const imageResponse = await openai.images.generate({
      prompt: imagePrompt,
      n: 1,
      size: '1024x1024',
      user: interaction.user.id,
      model: 'gpt-image-1-mini',
    });
    const aiImage = imageResponse.data[0].b64_json;
    const aiImageName = `${uuidv4()}.png`;
    const embedFile = new AttachmentBuilder(Buffer.from(aiImage, 'base64'), {
      name: aiImageName,
    });

    // birdLog(`[/national-day] ${aiImage}`);

    const nationalDayEmbed = prepareEmbed({
      embedTitle: title,
      embedColor: randomColor,
      embedDescription: `${description} [Read More](${link})`, // \n\n**Haiku**\n${haiku}
      embedImage: `attachment://${aiImageName}`,
      embedUrl: link,
    });

    return await sendEmbed({
      interaction,
      content: nationalDayEmbed,
      file: embedFile,
      reaction: emojiJson.map((item) => item.emoji),
    });
  },
};
