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

      let imagePrompt = await openai.chat.completions.create({
        model: 'gpt-4.1-mini',
        messages: [
          {
            role: 'system',
            content: stripIndents`
            You're a helpful AI assistant that generates prompts to feed to GPT-Image to generate photos based on the user's input:
            - You should reply with a prompt that describes the images the user wants based on their input
            - Images should be captured in a realistic photograph with natural lighting
            - Images should not contain any text
            - Return only the text for image prompt
            `,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0,
        user: interaction.user.id,
      });

      imagePrompt = imagePrompt?.choices[0]?.message?.content
        .replace('Prompt for GPT-Image:', '')
        .trim();
      console.log(imagePrompt);

      const randomColor = getRandomColor();

      // const moderation = await openai.moderations.create({
      //   input: imagePrompt,
      //   model: 'text-moderation-latest',
      // });

      // if (moderation.results[0].flagged) {
      //   birdLog('[dall-e] failed moderation');
      //   const failedEmbed = prepareEmbed({
      //     embedFooter: prompt,
      //     embedImage:
      //       // 'https://media.giphy.com/media/TK3ZD4W7Lt83Cqzrf7/giphy.gif',
      //       'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYTQzODc1ZjQ1ODczMzM0MTAxOGQ1Y2FkMWQ0N2JlZDM4Mzg1OWNjOCZlcD12MV9pbnRlcm5hbF9naWZzX2dpZklkJmN0PWc/3oKIPD4zpQPe4OMCyc/giphy.gif',
      //     embedDescription: 'Input Failed Moderation Check',
      //   });
      //   return await sendEmbed({
      //     interaction,
      //     content: failedEmbed,
      //   });
      // }

      // birdLog('[dall-e] passed moderation');

      let aiImageName = null;
      let embedFile = null;
      let embedImage = '';

      try {
        const response = await openai.images.generate({
          prompt: imagePrompt,
          n: 1,
          size: '1024x1024',
          model: 'gpt-image-1',
          moderation: 'low',
          user: interaction.user.id,
        });
        // console.log(response.data[0].b64_json);
        const aiImage = response.data[0].b64_json;
        aiImageName = `${uuidv4()}.png`;
        embedFile = new AttachmentBuilder(Buffer.from(aiImage, 'base64'), { name: aiImageName });
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
