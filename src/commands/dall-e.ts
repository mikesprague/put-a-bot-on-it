import { stripIndents } from 'common-tags';
import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import OpenAI from 'openai';

import {
  birdLog,
  generateImageAttachment,
  getCustomEmojiCode,
  getRandomColor,
  prepareEmbed,
  sendEmbed,
} from '../lib/helpers.ts';

const { OPENAI_API_KEY } = process.env;

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
  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    const prompt = interaction.options.getString('query')!;

    try {
      const openai = new OpenAI({
        apiKey: OPENAI_API_KEY!,
      });

      birdLog(`[dall-e] ${prompt}`);

      const imagePromptResponse = await openai.responses.create({
        model: 'gpt-5.6-luna',
        input: [
          {
            role: 'system',
            content: stripIndents`
            You're a helpful AI assistant that generates prompts to feed to GPT-Image to generate photos based on the user's input:
            - You should reply with a prompt that describes the image the user wants based on their input
            - The prompt should take advantage of the latest image generation capabilities of ChatGPT and the "gpt-image-2.5-flare" model
            - The prompt should be no more than 1 paragraph long
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

      const imagePrompt = imagePromptResponse.output_text
        .replace('Prompt for GPT-Image:', '')
        .trim();
      console.log(imagePrompt);

      const randomColor = getRandomColor();

      let embedFile: import('discord.js').AttachmentBuilder | null = null;
      let embedImage = '';

      try {
        const generated = await generateImageAttachment({
          openai,
          prompt: imagePrompt,
          userId: interaction.user.id,
          options: { moderation: 'low', quality: 'auto' },
        });
        embedFile = generated.embedFile;
        embedImage = generated.embedImage;
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
      const err = error as { response?: { data?: unknown }; message?: unknown };
      if (err.response) {
        returnMessage = String(err.response.data ?? '');
      } else {
        const errorMessage =
          err.message !== undefined ? String(err.message) : String(err);
        console.log(errorMessage);
        returnMessage = errorMessage;
      }
      await interaction.followUp({ content: returnMessage });
    }
  },
};
