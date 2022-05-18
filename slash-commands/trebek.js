import { SlashCommandBuilder } from '@discordjs/builders';

import {
  getRandomColor,
  getRandomNum,
  // getGiphyGifs,
  getTenorGifs,
  prepareEmbed,
  sendEmbed,
} from '../lib/helpers.js';

export default {
  data: new SlashCommandBuilder()
    .setName('trebek')
    .setDescription('Random SNL Celebrity Jeopardy gif')
    .addStringOption((option) =>
      option.setName('query').setDescription('Enter optional search query'),
    ),
  async execute(interaction) {
    const arg = interaction.options.getString('query');
    const useArg = Boolean(arg && arg.trim().length);
    const searchTerm1 = useArg ? `@snl jeopardy ${arg}` : '@snl jeopardy';
    const searchTerm2 = useArg
      ? `snl celebrity jeopardy ${arg}`
      : 'snl celebrity jeopardy';
    // const trebekGifs1 = await getGiphyGifs({ searchTerm: searchTerm1 });
    // const trebekGifs2 = await getGiphyGifs({ searchTerm: searchTerm2 });
    const trebekGifs1 = await getTenorGifs({ searchTerm: searchTerm1 });
    const trebekGifs2 = await getTenorGifs({ searchTerm: searchTerm2 });
    const trebekGifs = [...trebekGifs1, ...trebekGifs2];
    const randomNum = useArg
      ? getRandomNum(Math.min(trebekGifs.length, 20))
      : getRandomNum(trebekGifs.length);
    const embedColor = getRandomColor();
    // const embedImage = trebekGifs[randomNum].images.original.url;
    const embedImage = trebekGifs[randomNum].media[0].gif.url;
    const trebekEmbed = prepareEmbed({
      embedImage,
      embedFooter: useArg ? `query: ${arg}` : '',
      embedColor,
    });
    sendEmbed(interaction, trebekEmbed);
  },
};
