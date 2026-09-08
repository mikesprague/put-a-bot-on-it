import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import OpenAI from 'openai';

import {
  birdLog,
  generateImageAttachment,
  getRandomColor,
  prepareEmbed,
  sendEmbed,
} from '../lib/helpers.ts';
import { gptGetEmoji, gptGetHaiku } from '../lib/openai.ts';

const { OPENAI_API_KEY } = process.env;

export default {
  data: new SlashCommandBuilder()
    .setName('haiku')
    .setDescription(`Get's an AI-generated haiku on the subject you provide`)
    .addStringOption((option) =>
      option
        .setName('subject')
        .setDescription('Provide a subject/topic for the haiku')
        .setRequired(true)
    ),
  // .addBooleanOption((option) =>
  //   option
  //     .setName('image')
  //     .setDescription('Include an image with the haiku')
  //     .setRequired(true)
  // ),
  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    const subject = interaction.options.getString('subject')!;

    const openai = new OpenAI({
      apiKey: OPENAI_API_KEY!,
    });

    const haiku = await gptGetHaiku({
      textToAnalyze: subject,
      openAiClient: openai,
    });

    birdLog(`[/haiku] ${haiku.replace('\n', ' ')}`);

    let embedFile: import('discord.js').AttachmentBuilder | null = null;
    let embedImage = '';

    const imagePrompt = `${haiku.replace(
      '\n',
      ' '
    )}, captured in a realistic photograph with natural lighting`;

    try {
      const generated = await generateImageAttachment({
        openai,
        prompt: imagePrompt,
        userId: interaction.user.id,
      });
      embedFile = generated.embedFile;
      embedImage = generated.embedImage;
    } catch (error) {
      birdLog(`[/haiku] image generation failed for prompt: ${imagePrompt}`);
      console.log(error);
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
