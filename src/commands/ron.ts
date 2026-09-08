import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';

import {
  getCustomEmojiCode,
  getKlipyGifs,
  getRandomColor,
  getRandomNum,
  makeApiCall,
  prepareEmbed,
  sendEmbed,
} from '../lib/helpers.ts';
import { ronSwansonApi } from '../lib/urls.ts';

export default {
  data: new SlashCommandBuilder()
    .setName('ron')
    .setDescription(
      'Random Ron Swanson Klipy GIF with a random Ron Swanson quote from an API'
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();
    const apiUrl = ronSwansonApi();
    const searchTerm = 'ron swanson';
    const apiData = await makeApiCall(apiUrl);
    const randomColor = getRandomColor();
    const ronGifs = await getKlipyGifs({
      searchTerm: `${searchTerm} ${apiData[0]}`,
    });
    const randomNum = getRandomNum(ronGifs.length);
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
