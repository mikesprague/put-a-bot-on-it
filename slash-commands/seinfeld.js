import { SlashCommandBuilder } from '@discordjs/builders';

import {
  getRandomNum,
  getRandomColor,
  getGifs,
  getTenorGifs,
  prepareEmbed,
  sendEmbed,
} from '../lib/helpers.js';

export default {
  data: new SlashCommandBuilder()
    .setName('seinfeld')
    .setDescription('Random Seinfeld GIF from Tenor')
    .addStringOption((option) =>
      option.setName('query').setDescription('Enter optional search query'),
    ),
  async execute(interaction) {
    const arg = interaction.options.getString('query');
    const useArg = Boolean(arg && arg.trim().length);
    const searchTerm = useArg ? `seinfeld ${arg}` : 'seinfeld';
    // const seinfeldGifs = await getGifs({ searchTerm });
    const seinfeldGifs = await getTenorGifs({ searchTerm });
    const randomNum = useArg
      ? getRandomNum(Math.min(seinfeldGifs.length, 20))
      : getRandomNum(seinfeldGifs.length);
    const embedColor = getRandomColor();
    // const embedImage = seinfeldGifs[randomNum].images.original.url;
    const embedImage = seinfeldGifs[randomNum].media[0].gif.url;
    const seinfeldEmbed = prepareEmbed({
      embedImage,
      embedFooter: useArg ? `query: ${arg}` : '',
      embedColor,
    });
    sendEmbed(interaction, seinfeldEmbed);
  },
};
