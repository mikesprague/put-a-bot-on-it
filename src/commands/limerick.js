import { Configuration, OpenAIApi } from 'openai';
import { AttachmentBuilder, SlashCommandBuilder } from 'discord.js';
import { v4 as uuidv4 } from 'uuid';
import {
  birdLog,
  prepareEmbed,
  sendEmbed,
  getRandomColor,
} from '../lib/helpers.js';
import { gptGetEmoji, gptGetLimerick } from '../lib/openai.js';

const { OPEN_AI_API_KEY } = process.env;

export default {
  data: new SlashCommandBuilder()
    .setName('limerick')
    .setDescription(`Get's an AI-generated limerick on the subject you provide`)
    .addStringOption((option) =>
      option
        .setName('subject')
        .setDescription('Provide a subject/topic for the limerick')
        .setRequired(true),
    ),
  async execute(interaction) {
    await interaction.deferReply();

    const subject = interaction.options.getString('subject');

    const configuration = new Configuration({
      apiKey: OPEN_AI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    birdLog(`[/limerick] ${subject}`);

    const limerick = await gptGetLimerick({
      textToAnalyze: subject,
      openAiClient: openai,
      temperature: 0.3,
      user: interaction.user.id,
    });

    birdLog(`[/limerick] ${limerick.replace('\n', ' ')}`);

    const emojiJson = await gptGetEmoji(limerick, openai, interaction);
    console.log('[/limerick]', emojiJson);

    // const imagePrompt = `${limerick.replace('\n', ' ')}, photo, detailed image`;
    // const imageResponse = await openai.createImage({
    //   prompt: imagePrompt,
    //   n: 1,
    //   size: '1024x1024',
    //   user: interaction.user.id,
    // });
    // // console.log(imageResponse.data);
    // const aiImage = imageResponse.data.data[0].url;
    // const aiImageName = `${uuidv4()}.png`;

    // const embedFile = new AttachmentBuilder(aiImage, { name: aiImageName });

    const randomColor = getRandomColor();

    const limerickEmbed = prepareEmbed({
      embedColor: randomColor,
      embedDescription: limerick,
      // embedImage: `attachment://${aiImageName}`,
    });

    return await sendEmbed({
      interaction,
      content: limerickEmbed,
      reaction: emojiJson.map((item) => item.emoji),
      deferred: true,
    });
  },
};
