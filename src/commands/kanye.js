import { SlashCommandBuilder } from 'discord.js';
import {
  getKlipyGifs,
  getRandomColor,
  getRandomNum,
  makeApiCall,
  prepareEmbed,
  sendEmbed,
} from '../lib/helpers.js';
import { kanyeApi } from '../lib/urls.js';

export default {
  data: new SlashCommandBuilder()
    .setName('kanye')
    .setDescription(
      'Random Kanye West GIF from Klipy with a random Kanye West quote from https://kanye.rest'
    ),
  async execute(interaction) {
    await interaction.deferReply();
    const searchTerm = 'kanye';
    const emojiList = ['824289925129961513', '824291309224984656'];
    const kanyeEmoji = emojiList[getRandomNum(emojiList.length)];
    const apiUrl = kanyeApi();
    const randomColor = getRandomColor();
    const kanyeData = await makeApiCall(apiUrl);
    const kanyeGifs = await getKlipyGifs({
      searchTerm: `${searchTerm} ${kanyeData.quote}`,
    });
    const randomNum = getRandomNum(kanyeGifs.length);
    const randomKanye = kanyeGifs[randomNum].file.hd.gif.url;
    const kanyeEmbed = prepareEmbed({
      embedColor: randomColor,
      embedDescription: kanyeData.quote,
      embedImage: randomKanye,
    });
    return sendEmbed({
      interaction,
      content: kanyeEmbed,
      reaction: kanyeEmoji,
    });
  },
};
