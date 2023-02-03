import { SlashCommandBuilder } from 'discord.js';
import { Configuration, OpenAIApi } from 'openai';
import { getRandomColor, prepareEmbed, sendEmbed } from '../lib/helpers.js';

const { OPEN_AI_API_KEY } = process.env;

export default {
  data: new SlashCommandBuilder()
    .setName('dall-e')
    .setDescription('AI generated artwork - powered by OpenAI')
    .addStringOption((option) =>
      option
        .setName('query')
        .setDescription('Enter description')
        .setRequired(true),
    ),
  async execute(interaction) {
    await interaction.deferReply();

    const description = interaction.options.getString('query');

    const configuration = new Configuration({
      apiKey: OPEN_AI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);
    const response = await openai.createImage({
      prompt: description,
      n: 1,
      size: '1024x1024',
    });
    // console.log(response.data);

    const randomColor = getRandomColor();

    const artworkEmbed = prepareEmbed({
      embedFooter: description,
      embedImage: response.data.data[0].url,
      embedColor: randomColor,
    });

    return sendEmbed({
      interaction,
      content: artworkEmbed,
    });
  },
};
