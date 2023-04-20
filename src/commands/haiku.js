import { Configuration, OpenAIApi } from 'openai';
import { AttachmentBuilder, SlashCommandBuilder } from 'discord.js';
import { v4 as uuidv4 } from 'uuid';
import {
  birdLog,
  prepareEmbed,
  sendEmbed,
  getRandomColor,
} from '../lib/helpers.js';

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

    const haikuPrompt = `Generate a haiku about the subject: ${subject}`;

    const haikuResponse = await openai.createChatCompletion({
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
        user: interaction.user.id,
      });
      const aiImage = imageResponse.data.data[0].url;
      aiImageName = `${uuidv4()}.png`;
      embedImage = `attachment://${aiImageName}`;
      embedFile = new AttachmentBuilder(aiImage, { name: aiImageName });
    } catch (error) {
      console.log(
        `[/haiku] image generation failed for prompt: ${imagePrompt}`,
      );
    }

    const haikuEmbed = prepareEmbed({
      embedColor: getRandomColor(),
      embedDescription: haiku,
      embedImage,
    });

    return await sendEmbed({
      interaction,
      content: haikuEmbed,
      file: embedFile,
      deferred: true,
    });
  },
};