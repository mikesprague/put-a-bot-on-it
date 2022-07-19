import { SlashCommandBuilder } from 'discord.js';
import {
  // getGiphyGifs,
  getTenorGifs,
  getRandomNum,
  getRandomColor,
  makeApiCall,
  prepareEmbed,
  sendEmbed,
} from '../lib/helpers.js';
import { kanyeApi } from '../lib/urls.js';

export default {
  data: new SlashCommandBuilder()
    .setName('kanye')
    .setDescription(
      'Random Kanye West quote from https://kanye.rest with GIF from Tenor',
    ),
  async execute(interaction) {
    const searchTerm = 'kanye';
    // const kanyeGifs = await getGiphyGifs({ searchTerm });
    const kanyeGifs = await getTenorGifs({ searchTerm });
    const emojiList = ['824289925129961513', '824291309224984656'];
    const kanyeEmoji = emojiList[getRandomNum(emojiList.length)];
    const apiUrl = kanyeApi();
    const randomColor = getRandomColor();
    const kanyeData = await makeApiCall(apiUrl);
    const randomNum = getRandomNum(kanyeGifs.length);
    // const randomKanye = kanyeGifs[randomNum].images.original.url;
    const randomKanye = kanyeGifs[randomNum].media_formats.gif.url;
    const kanyeEmbed = prepareEmbed({
      embedColor: randomColor,
      embedDescription: kanyeData.quote,
      embedImage: randomKanye,
    });
    return sendEmbed(interaction, kanyeEmbed, kanyeEmoji);
  },
};
