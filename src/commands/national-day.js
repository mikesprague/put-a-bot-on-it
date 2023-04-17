import { Configuration, OpenAIApi } from 'openai';
import { SlashCommandBuilder } from 'discord.js';

import {
  // getTenorGifs,
  getRandomNum,
  getRandomColor,
  prepareEmbed,
  sendEmbed,
  birdLog,
} from '../lib/helpers.js';
import { initNationalDayData } from '../lib/national-day.js';

const { OPEN_AI_API_KEY } = process.env;

export default {
  data: new SlashCommandBuilder()
    .setName('national-day')
    .setDescription(
      'Random national day from National Day Calendar (w/ possibly related AI generated image)',
    ),
  async execute(interaction) {
    await interaction.deferReply();
    const configuration = new Configuration({
      apiKey: OPEN_AI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    const randomColor = getRandomColor();

    const nationalDayData = await initNationalDayData();

    const randomNum = getRandomNum(nationalDayData.length);
    const { title, description, link } = nationalDayData[randomNum];

    // let searchTermArray = title.split(' ');
    // const startTermsToRemove = ['national', 'international', 'world'];
    // if (startTermsToRemove.includes(searchTermArray[0].trim().toLowerCase())) {
    //   searchTermArray.shift();
    // }
    // const endTermsToRemove = ['day', 'eve'];
    // if (
    //   endTermsToRemove.includes(
    //     searchTermArray[searchTermArray.length - 1].trim().toLowerCase(),
    //   )
    // ) {
    //   searchTermArray.pop();
    // }
    // const searchTerm = searchTermArray.join(' ').toLowerCase();
    // const nationalDayGifs = await getGiphyGifs({ searchTerm });
    // let nationalDayGifs = await getTenorGifs({ searchTerm });
    // if (!nationalDayGifs.length) {
    //   nationalDayGifs = await getTenorGifs({ searchTerm: 'swedish chef' });
    // }
    // const randomGifNum = getRandomNum(nationalDayGifs.length);
    // // const randomGif = nationalDayGifs[randomGifNum].images.original.url;
    // const randomGif = nationalDayGifs[randomGifNum].media_formats.gif.url;

    const aiPrompt = `action shot representing ${title.toLowerCase()}, photo, detailed image, no text, no words, no text on image`;
    const aiResponse = await openai.createImage({
      prompt: aiPrompt,
      n: 1,
      size: '1024x1024',
      user: interaction.user.id,
    });
    const aiImage = aiResponse.data.data[0].url;

    const nationalDayEmbed = prepareEmbed({
      embedTitle: title,
      embedColor: randomColor,
      embedDescription: `${description} [Read More](${link})`,
      embedImage: aiImage,
      embedUrl: link,
    });
    birdLog(`[/national-day] ${title}`);
    return sendEmbed({
      interaction,
      content: nationalDayEmbed,
      reaction: '📅',
    });
  },
};
