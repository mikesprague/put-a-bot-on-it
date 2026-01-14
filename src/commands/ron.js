import { SlashCommandBuilder } from 'discord.js';
import {
  getCustomEmojiCode,
  getKlipyGifs,
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
    .setDescription('Random Ron Swanson quote from an API with GIF from Klipy'),
  async execute(interaction) {
    await interaction.deferReply();
    const apiUrl = ronSwansonApi();
    const searchTerm = 'ron swanson';
    const apiData = await makeApiCall(apiUrl);
    // const ronGifs = await getGiphyGifs({ searchTerm });
    const ronGifs = await getKlipyGifs({ searchTerm });
    // const ronStickers = await getGiphyGifs({ searchTerm, stickerSearch: true });
    // const allGifs = [...ronGifs, ...ronStickers];
    const randomNum = getRandomNum(ronGifs.length);
    const randomColor = getRandomColor();
    // const randomRon = ronGifs[randomNum].images.downsized.url;
    const randomRon = ronGifs[randomNum].file.hd.gif.url;
    const embed = prepareEmbed({
      embedColor: randomColor,
      embedDescription: apiData[0],
      embedImage: randomRon,
    });
    const ronEmoji = getCustomEmojiCode('ronswanson');
    return sendEmbed({ interaction, content: embed, reaction: ronEmoji });
  },
};
