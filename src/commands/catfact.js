import { stripIndents } from 'common-tags';
import { AttachmentBuilder, SlashCommandBuilder } from 'discord.js';
import { v4 as uuidv4 } from 'uuid';
import OpenAI from 'openai';

import {
  getCustomEmojiCode,
  getRandomColor,
  // getRandomGifByTerm,
  getRandomNum,
  makeApiCall,
  prepareEmbed,
  sendEmbed,
} from '../lib/helpers.js';
import { catFactsApi } from '../lib/urls.js';

const { OPEN_AI_API_KEY } = process.env;

export default {
  data: new SlashCommandBuilder()
    .setName('catfact')
    .setDescription('Random fact from the Cat Facts API'),
  async execute(interaction) {
    await interaction.deferReply();
    const openai = new OpenAI({
      apiKey: OPEN_AI_API_KEY,
    });
    const apiUrl = catFactsApi();
    const apiData = await makeApiCall(apiUrl, 'GET', {
      Accept: 'application/json',
      'User-Agent': 'BirdBot (Discord.js bot on private server)',
    }).then((response) => response.data);
    // const catGif = await getRandomGifByTerm('cat', false);
    const randomNum = getRandomNum(apiData.length);
    const randomColor = getRandomColor();
    const catFact = apiData[randomNum];
    console.log(catFact);
    let imagePrompt = await openai.chat.completions.create({
      model: 'gpt-4.1',
      messages: [
        {
          role: 'system',
          content: stripIndents`
            You're a helpful AI assistant that generates prompts to feed to DALL-E to generate photos based on the supplied cat fact:
            - Images should be captured in a realistic photograph with natural lighting
            - Images should not contain any text
            - Return only the text for image prompt
            `,
        },
        {
          role: 'user',
          content: catFact.fact,
        },
      ],
      temperature: 0,
      user: interaction.user.id,
    });

    imagePrompt = imagePrompt?.choices[0]?.message?.content
      .replace('Prompt for DALL-E:', '')
      .trim();
    console.log(imagePrompt);
    const response = await openai.images.generate({
      prompt: imagePrompt,
      n: 1,
      size: '1024x1024',
      model: 'dall-e-3',
      user: interaction.user.id,
    });
    const aiImage = response.data[0].url;
    const aiImageName = `${uuidv4()}.png`;
    const embedFile = new AttachmentBuilder(aiImage, { name: aiImageName });
    const embedImage = `attachment://${aiImageName}`;
    const catFactEmbed = prepareEmbed({
      embedDescription: catFact.fact,
      embedImage,
      embedColor: randomColor,
    });
    const emojiArray = ['cat_jam', 'party_cat'];
    const catEmoji = getCustomEmojiCode(
      emojiArray[getRandomNum(emojiArray.length)]
    );
    return sendEmbed({
      interaction,
      content: catFactEmbed,
      file: embedFile,
      reaction: catEmoji,
      deferred: true,
    });
  },
};
