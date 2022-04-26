import { SlashCommandBuilder } from '@discordjs/builders';
import {
  getGifs,
  getRandomNum,
  getRandomColor,
  makeApiCall,
  prepareEmbed,
  sendEmbed,
} from '../lib/helpers.js';
import { nationalDayApi } from '../lib/urls.js';

export default {
  data: new SlashCommandBuilder()
    .setName('national-day')
    .setDescription(
      'Random national day from National Day Calendar (w/ possibly related GIF from Giphy API)',
    ),
  async execute(interaction) {
    const apiUrl = nationalDayApi();
    const randomColor = getRandomColor();
    const nationalDayData = await makeApiCall(apiUrl);
    const randomNum = getRandomNum(nationalDayData.length);
    const { title, description, link } = nationalDayData[randomNum];

    let searchTermArray = title.split(' ');
    const startTermsToRemove = ['national', 'international', 'world'];
    if (startTermsToRemove.includes(searchTermArray[0].trim().toLowerCase())) {
      searchTermArray.shift();
    }
    const endTermsToRemove = ['day', 'eve'];
    if (
      endTermsToRemove.includes(
        searchTermArray[searchTermArray.length - 1].trim().toLowerCase(),
      )
    ) {
      searchTermArray.pop();
    }
    const searchTerm = searchTermArray.join(' ').toLowerCase();
    const nationalDayGifs = await getGifs({ searchTerm });
    const randomGifNum = getRandomNum(nationalDayGifs.length);
    const randomGif = nationalDayGifs[randomGifNum].images.original.url;
    const nationalDayEmbed = prepareEmbed({
      embedTitle: title,
      embedColor: randomColor,
      embedDescription: `${description} [Read More](${link})`,
      embedImage: randomGif,
      embedUrl: link,
    });
    return sendEmbed(interaction, nationalDayEmbed);
  },
};
