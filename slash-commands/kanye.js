import { SlashCommandBuilder } from '@discordjs/builders';
import {
  getGifs,
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
      'Random Kanye West quote from https://kanye.rest with GIF from Giphy',
    ),
  async execute(interaction) {
    const searchTerm = 'kanye';
    // const kanyeGifs = await getGifs({ searchTerm });
    const kanyeGifs = await getTenorGifs({ searchTerm });
    // const kanyeStickers = await getGifs({ searchTerm, stickerSearch: true });
    // const allKanyeGifs = [...kanyeGifs, ...kanyeStickers];
    const apiUrl = kanyeApi();
    const randomColor = getRandomColor();
    const kanyeData = await makeApiCall(apiUrl);
    const randomNum = getRandomNum(kanyeGifs.length);
    // const randomKanye = kanyeGifs[randomNum].images.original.url;
    const randomKanye = kanyeGifs[randomNum].media[0].gif.url;
    const kanyeEmbed = prepareEmbed({
      embedColor: randomColor,
      embedDescription: kanyeData.quote,
      embedImage: randomKanye,
    });
    return sendEmbed(interaction, kanyeEmbed);
  },
};
