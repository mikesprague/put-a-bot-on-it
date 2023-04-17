import { SlashCommandBuilder } from 'discord.js';
import { Configuration, OpenAIApi } from 'openai';
import {
  birdLog,
  getRandomColor,
  prepareEmbed,
  sendEmbed,
} from '../lib/helpers.js';

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

    const prompt = interaction.options.getString('query');

    try {
      const configuration = new Configuration({
        apiKey: OPEN_AI_API_KEY,
      });
      const openai = new OpenAIApi(configuration);

      birdLog(`[dall-e] ${prompt}`);

      const randomColor = getRandomColor();

      const moderation = await openai.createModeration({
        input: prompt,
      });

      if (moderation.data.results[0].flagged) {
        birdLog(`[dall-e] failed moderation`);
        const failedEmbed = prepareEmbed({
          embedFooter: prompt,
          embedDescription: 'Input Failed Moderation Check',
        });
        return sendEmbed({
          interaction,
          content: failedEmbed,
        });
      } else {
        birdLog(`[dall-e] passed moderation`);
        const response = await openai.createImage({
          prompt,
          n: 1,
          size: '1024x1024',
          user: interaction.user.id,
        });
        // console.log(response.data);

        const artworkEmbed = prepareEmbed({
          embedFooter: prompt,
          embedImage: response.data.data[0].url,
          embedColor: randomColor,
        });

        birdLog(`[dall-e] ${response.data.data[0].url}`);

        return sendEmbed({
          interaction,
          content: artworkEmbed,
        });
      }
    } catch (error) {
      let returnMessage = '';
      if (error.response) {
        // console.log(error.response.status);
        // console.log(error.response.data);
        returnMessage = error.response.data;
      } else {
        console.log(error.message);
        returnMessage = error.message;
      }
      await interaction.followUp(returnMessage);
      // sendContent({ interaction, content: returnMessage });
    }
  },
};
