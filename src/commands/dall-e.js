import { AttachmentBuilder, SlashCommandBuilder } from 'discord.js';
import { v4 as uuidv4 } from 'uuid';
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
        model: 'text-moderation-latest',
      });

      if (moderation.data.results[0].flagged) {
        birdLog(`[dall-e] failed moderation`);
        const failedEmbed = prepareEmbed({
          embedFooter: prompt,
          embedImage:
            // 'https://media.giphy.com/media/TK3ZD4W7Lt83Cqzrf7/giphy.gif',
            'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYTQzODc1ZjQ1ODczMzM0MTAxOGQ1Y2FkMWQ0N2JlZDM4Mzg1OWNjOCZlcD12MV9pbnRlcm5hbF9naWZzX2dpZklkJmN0PWc/3oKIPD4zpQPe4OMCyc/giphy.gif',
          embedDescription: 'Input Failed Moderation Check',
        });
        return await sendEmbed({
          interaction,
          content: failedEmbed,
        });
      } else {
        birdLog(`[dall-e] passed moderation`);

        let aiImageName = null;
        let embedFile = null;
        let embedImage = '';

        try {
          const response = await openai.createImage({
            prompt,
            n: 1,
            size: '1024x1024',
          });
          // console.log(response.data);

          const aiImage = response.data.data[0].url;
          aiImageName = `${uuidv4()}.png`;
          embedFile = new AttachmentBuilder(aiImage, { name: aiImageName });
          embedImage = `attachment://${aiImageName}`;
          birdLog(`[dall-e] ${response.data.data[0].url}`);
        } catch (error) {
          birdLog(`[/dall-e] image generation failed for prompt: ${prompt}`);
          embedImage =
            'https://media.giphy.com/media/U1aN4HTfJ2SmgB2BBK/giphy.gif';
        }

        const artworkEmbed = prepareEmbed({
          embedFooter: prompt,
          embedImage,
          embedColor: randomColor,
        });

        return await sendEmbed({
          interaction,
          content: artworkEmbed,
          file: embedFile,
          deferred: true,
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
