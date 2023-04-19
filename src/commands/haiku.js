import { Configuration, OpenAIApi } from 'openai';
import { SlashCommandBuilder } from 'discord.js';
import {
  birdLog,
  sendContent,
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
        .setRequired(true)
    ),
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
    
    birdLog(`[/haiku] ${haiku}`);

    return await sendContent({interaction, content: haiku, deferred: true });
  },
};
