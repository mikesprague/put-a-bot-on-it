import { Configuration, OpenAIApi } from 'openai';
import { AttachmentBuilder, SlashCommandBuilder } from 'discord.js';
import { v4 as uuidv4 } from 'uuid';
import {
  birdLog,
  prepareEmbed,
  sendEmbed,
  getRandomColor,
} from '../lib/helpers.js';
import { gptGetEmoji, gptGetHaiku } from '../lib/openai.js';

const { OPEN_AI_API_KEY } = process.env;

export default {
  data: new SlashCommandBuilder()
    .setName('haiku')
    .setDescription(`Get's an AI-generated haiku on the subject you provide`)
    .addStringOption((option) =>
      option
        .setName('subject')
        .setDescription('Provide a subject/topic for the haiku')
        .setRequired(true),
    ),
  // .addBooleanOption((option) =>
  //   option
  //     .setName('image')
  //     .setDescription('Include an image with the haiku')
  //     .setRequired(true)
  // ),
  async execute(interaction) {
    await interaction.deferReply();

    const subject = interaction.options.getString('subject');

    const configuration = new Configuration({
      apiKey: OPEN_AI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    const haiku = await gptGetHaiku({
      textToAnalyze: subject,
      openAiClient: openai,
      temperature: 0.2,
    });

    birdLog(`[/haiku] ${haiku.replace('\n', ' ')}`);

    let aiImageName = null;
    let embedFile = null;
    let embedImage = '';

    const imagePrompt = `${haiku.replace('\n', ' ')}, photo, detailed image`;

    try {
      const imageResponse = await openai.createImage({
        prompt: imagePrompt,
        n: 1,
        size: '1024x1024',
      });
      const aiImage = imageResponse.data.data[0].url;
      aiImageName = `${uuidv4()}.png`;
      embedImage = `attachment://${aiImageName}`;
      embedFile = new AttachmentBuilder(aiImage, { name: aiImageName });
    } catch (error) {
      birdLog(`[/haiku] image generation failed for prompt: ${imagePrompt}`);
    }

    const emojiJson = await gptGetEmoji({
      textToAnalyze: haiku,
      openAiClient: openai,
    });
    // birdLog('[/haiku]', emojiJson);

    const haikuEmbed = prepareEmbed({
      embedColor: getRandomColor(),
      embedDescription: haiku,
      embedImage,
    });

    return await sendEmbed({
      interaction,
      content: haikuEmbed,
      file: embedFile,
      reaction: emojiJson.map((item) => item.emoji),
      deferred: true,
    });
  },
};
