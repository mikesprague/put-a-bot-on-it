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
    .setName('limerick')
    .setDescription(`Get's an AI-generated limerick on the subject you provide`)
    .addStringOption((option) =>
      option
        .setName('subject')
        .setDescription('Provide a subject/topic for the limerick')
        .setRequired(true)
    ),
  async execute(interaction) {
    await interaction.deferReply();

    const subject = interaction.options.getString('subject');

    const configuration = new Configuration({
      apiKey: OPEN_AI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    const limerickPrompt = `Generate a limerick about the subject: ${subject}`;

    const limerickResponse = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'assistant',
          content: limerickPrompt,
        },
      ],
      temperature: 0.2,
      user: interaction.user.id,
    });

    const limerick = limerickResponse.data.choices[0].message.content;
    
    birdLog(`[/limerick] ${limerick.replace('\n', ' ')}`);

    const imagePrompt = `${limerick.replace('\n', ' ')}, photo, detailed image`;
    const imageResponse = await openai.createImage({
      prompt: imagePrompt,
      n: 1,
      size: '1024x1024',
      user: interaction.user.id,
    });
    // console.log(imageResponse.data);
    const aiImage = imageResponse.data.data[0].url;
    const aiImageName = `${uuidv4()}.png`;

    const embedFile = new AttachmentBuilder(aiImage, { name: aiImageName });

    const randomColor = getRandomColor();

    const limerickEmbed = prepareEmbed({
      embedColor: randomColor,
      embedDescription: limerick,
      embedImage: `attachment://${aiImageName}`,
    })

    return await sendEmbed({interaction, content: limerickEmbed, file: embedFile, deferred: true });
  },
};
