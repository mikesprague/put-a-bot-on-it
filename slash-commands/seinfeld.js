import { SlashCommandBuilder } from '@discordjs/builders';

import {
  getRandomNum,
  getRandomColor,
  getGifs,
  prepareEmbed,
  sendEmbed,
} from '../lib/helpers.js';

export default {
  data: new SlashCommandBuilder()
    .setName('seinfeld')
    .setDescription('Random Seinfeld GIF from Giphy')
    .addStringOption((option) =>
      option.setName('query').setDescription('Enter optional search query'),
    ),
  async execute(interaction) {
    const arg = interaction.options.getString('query');
    const useArg = Boolean(arg && arg.trim().length);
    const searchTerm = useArg ? `seinfeld ${arg}` : 'seinfeld';
    const seinfeldGifs = await getGifs({ searchTerm });
    const randomNum = useArg
      ? getRandomNum(Math.min(seinfeldGifs.length, 10))
      : getRandomNum(seinfeldGifs.length);
    const embedColor = getRandomColor();
    const embedImage = seinfeldGifs[randomNum].images.original.url;
    const seinfeldEmbed = prepareEmbed({
      embedImage,
      embedFooter: useArg ? `query: ${arg}` : '',
      embedColor,
    });
    sendEmbed(interaction, seinfeldEmbed);
  },
};
