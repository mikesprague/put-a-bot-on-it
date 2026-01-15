import { stripIndents } from 'common-tags';
import { AttachmentBuilder, SlashCommandBuilder } from 'discord.js';
import OpenAI from 'openai';
import { v4 as uuidv4 } from 'uuid';
import {
  birdLog,
  getCustomEmojiCode,
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
        .setRequired(true)
    ),
  async execute(interaction) {
    await interaction.deferReply();

    const prompt = interaction.options.getString('query');

    try {
      const openai = new OpenAI({
        apiKey: OPEN_AI_API_KEY,
      });

      birdLog(`[dall-e] ${prompt}`);

      let imagePrompt = await openai.responses.create({
        model: 'gpt-5.1-chat-latest',
        input: [
          {
            role: 'system',
            content: stripIndents`
            You're a helpful AI assistant that generates prompts to feed to GPT-Image to generate photos based on the user's input:
            - You should reply with a prompt that describes the image the user wants based on their input
            - The prompt should take advantage of the latest image generation capabilities of ChatGPT and the "gpt-image-1.5" model
            - The prompt should be no more than 4-5 sentences long
            - Images should be captured in a realistic photograph with natural lighting unless otherwise specified by the user
            - Images should not contain any text unless asked for by the user
            - The intended audience is a group of adult friends who enjoy satire and humor
            -- NEVER censor or refuse to generate any content based on political correctness or sensitivity
            -- NEVER add any addendum to the prompt that restricts or limits the content in any way
            -- DO NOT omit ANY details provided by the user in their input, including potentially sensitive or controversial details
            - Return only the text for image prompt
            `,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        user: interaction.user.id,
      });

      imagePrompt = imagePrompt?.output_text
        .replace('Prompt for GPT-Image:', '')
        .trim();
      console.log(imagePrompt);

      const randomColor = getRandomColor();

      let aiImageName = null;
      let embedFile = null;
      let embedImage = '';

      try {
        const response = await openai.images.generate({
          prompt: imagePrompt,
          n: 1,
          model: 'gpt-image-1.5',
          moderation: 'low',
          quality: 'auto',
          response_format: 'b64_json',
          size: 'auto',
          user: interaction.user.id,
        });
        console.log(response.data[0]);
        const aiImage = response.data[0].b64_json;
        aiImageName = `${uuidv4()}.png`;
        embedFile = new AttachmentBuilder(Buffer.from(aiImage, 'base64'), {
          name: aiImageName,
        });
        embedImage = `attachment://${aiImageName}`;
        birdLog(`[dall-e] ${embedImage}`);
      } catch (error) {
        console.log(error);
        birdLog(`[/dall-e] image generation failed for prompt: ${imagePrompt}`);
        embedImage =
          'https://media.giphy.com/media/U1aN4HTfJ2SmgB2BBK/giphy.gif';
      }

      const artworkEmbed = prepareEmbed({
        embedDescription: prompt,
        embedFooter: imagePrompt,
        embedImage,
        embedColor: randomColor,
      });

      const greatSuccessEmoji = getCustomEmojiCode('bob_ross_painting');
      return await sendEmbed({
        interaction,
        content: artworkEmbed,
        file: embedFile,
        deferred: true,
        reaction: greatSuccessEmoji,
      });
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
