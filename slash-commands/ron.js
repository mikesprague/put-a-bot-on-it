import { SlashCommandBuilder } from '@discordjs/builders';
import {
  getGifs,
  getRandomColor,
  getRandomNum,
  makeApiCall,
  prepareEmbed,
  sendEmbed,
} from '../lib/helpers.js';
import { ronSwansonApi } from '../lib/urls.js';

export default {
  data: new SlashCommandBuilder()
    .setName('ron')
    .setDescription('Random Ron Swanson quote from an API with GIF from Giphy'),
  async execute(interaction) {
    const apiUrl = ronSwansonApi();
    const searchTerm = 'ron swanson';
    const apiData = await makeApiCall(apiUrl);
    const ronGifs = await getGifs({ searchTerm });
    // const ronStickers = await getGifs({ searchTerm, stickerSearch: true });
    // const allGifs = [...ronGifs, ...ronStickers];
    const randomNum = getRandomNum(ronGifs.length);
    const randomColor = getRandomColor();
    const randomRon = ronGifs[randomNum].images.downsized.url;
    const embed = prepareEmbed({
      embedColor: randomColor,
      embedDescription: apiData[0],
      embedImage: randomRon,
    });
    return sendEmbed(interaction, embed);
  },
};
