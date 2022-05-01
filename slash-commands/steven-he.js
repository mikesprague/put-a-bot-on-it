import { SlashCommandBuilder } from '@discordjs/builders';

import {
  getRandomNum,
  getRandomColor,
  // getGifs,
  getTenorGifs,
  prepareEmbed,
  sendEmbed,
} from '../lib/helpers.js';

export default {
  data: new SlashCommandBuilder()
    .setName('steven-he')
    .setDescription('Random Steven He GIF from Giphy')
    .addStringOption((option) =>
      option.setName('query').setDescription('Enter optional search query'),
    ),
  async execute(interaction) {
    const arg = interaction.options.getString('query');
    const useArg = Boolean(arg && arg.trim().length);
    const searchTerm = useArg ? `steven he ${arg}` : 'steven he';
    // const stevenHeGifs = await getGifs({ searchTerm });
    const stevenHeGifs = await getTenorGifs({ searchTerm });
    const randomNum = useArg
      ? getRandomNum(Math.min(stevenHeGifs.length, 10))
      : getRandomNum(stevenHeGifs.length);
    const embedColor = getRandomColor();
    // const embedImage = stevenHeGifs[randomNum].images.original.url;
    const embedImage = stevenHeGifs[randomNum].media[0].gif.url;
    const stevenHeEmbed = prepareEmbed({
      embedImage,
      embedFooter: useArg ? `query: ${arg}` : '',
      embedColor,
    });
    sendEmbed(interaction, stevenHeEmbed);
  },
};