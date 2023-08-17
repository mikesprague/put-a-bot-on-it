import OpenAI from 'openai';
import { AttachmentBuilder, SlashCommandBuilder } from 'discord.js';
import { oneLineTrim } from 'common-tags';
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

    const openai = new OpenAI({
      apiKey: OPEN_AI_API_KEY,
    });

    const randomColor = getRandomColor();

    const nationalDayData = await initNationalDayData();

    const randomNum = getRandomNum(nationalDayData.length);
    const { title, description, link } = nationalDayData[randomNum];

    birdLog('[/national-day]', title);

    const systemPrompt = oneLineTrim`
      You are an AI assistant set up to specifically to extract the topics and subjects from text input by your users.
      You should reply with a short but descriptive paragraph of 3 sentences or less and try to avoid general words
      like "celebration", "day", "week", "month", "national", or "international" and stick to describing the topics
      and/or subjects. Do not mention the specific occasion, just describe it.
    `;

    const textResponse = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: description,
        },
      ],
      temperature: 0.1,
      user: uuidv4(),
    });

    // console.log(textPrompt);
    // console.log(textResponse.choices[0].message.content);
    const aiSummary = textResponse.choices[0].message.content;
    birdLog(`[/national-day] ${aiSummary}`);

    const emojiJson = await gptGetEmoji({
      textToAnalyze: aiSummary,
      openAiClient: openai,
    });

    const imagePrompt = `action shot of ${aiSummary}, photo, extremely detailed, perfect composition, no words`;
    const imageResponse = await openai.images.generate({
      prompt: imagePrompt,
      n: 1,
      size: '1024x1024',
      user: uuidv4(),
    });
    const aiImage = imageResponse.data[0].url;
    const aiImageName = `${uuidv4()}.png`;

    const embedFile = new AttachmentBuilder(aiImage, { name: aiImageName });

    // birdLog(`[/national-day] ${aiImage}`);

    // const haiku = await gptGetHaiku({
    //   textToAnalyze: aiSummary,
    //   openAiClient: openai,
    // });

    const nationalDayEmbed = prepareEmbed({
      embedTitle: title,
      embedColor: randomColor,
      embedDescription: `${description} [Read More](${link})`, // \n\n**Haiku**\n${haiku}
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
