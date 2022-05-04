import { SlashCommandBuilder } from '@discordjs/builders';

import {
  getRandomColor,
  getRandomNum,
  getTenorGifs,
  prepareEmbed,
  sendEmbed,
} from '../lib/helpers.js';

export default {
  data: new SlashCommandBuilder()
    .setName('tourettes')
    .setDescription("Random Tourette's Guy GIF")
    .addStringOption((option) =>
      option.setName('query').setDescription('Enter optional search query'),
    ),
  async execute(interaction) {
    const arg = interaction.options.getString('query');
    const useArg = Boolean(arg && arg.trim().length);
    const searchTerm1 = useArg ? `tourettes guy ${arg}` : 'tourettes guy';
    // const searchTerm2 = useArg ? `tourettes ${arg}` : 'tourettes';
    const tourettesGifs = await getTenorGifs({ searchTerm: searchTerm1 });
    // const tourettesGifs2 = await getTenorGifs({ searchTerm: searchTerm2 });
    // const tourettesGifs = [...tourettesGifs1, ...tourettesGifs2];
    const randomNum = useArg
      ? getRandomNum(Math.min(tourettesGifs.length, 20))
      : getRandomNum(tourettesGifs.length);
    const embedColor = getRandomColor();
    const embedImage = tourettesGifs[randomNum].media[0].gif.url;
    const tourettesEmbed = prepareEmbed({
      embedImage,
      embedFooter: useArg ? `query: ${arg}` : '',
      embedColor,
    });
    sendEmbed(interaction, tourettesEmbed);
  },
};
