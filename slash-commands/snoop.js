import { SlashCommandBuilder } from '@discordjs/builders';

import {
  getCustomEmojiCode,
  getRandomNum,
  getRandomColor,
  // getGiphyGifs,
  getTenorGifs,
  prepareEmbed,
  sendEmbed,
} from '../lib/helpers.js';

export default {
  data: new SlashCommandBuilder()
    .setName('snoop')
    .setDescription('Random Snoop Dogg GIF from Tenor')
    .addStringOption((option) =>
      option.setName('query').setDescription('Enter optional search query'),
    ),
  async execute(interaction) {
    const arg = interaction.options.getString('query');
    const useArg = Boolean(arg && arg.trim().length);
    const searchTerm = useArg ? `snoop dogg ${arg}` : 'snoop dogg';
    // const snoopGifs = await getGiphyGifs({ searchTerm });
    const snoopGifs = await getTenorGifs({ searchTerm });
    const randomNum = useArg
      ? getRandomNum(Math.min(snoopGifs.length, 20))
      : getRandomNum(snoopGifs.length);
    const embedColor = getRandomColor();
    // const embedImage = snoopGifs[randomNum].images.original.url;
    const embedImage = snoopGifs[randomNum].media[0].gif.url;
    const snoopEmbed = prepareEmbed({
      embedImage,
      embedFooter: useArg ? `query: ${arg}` : '',
      embedColor,
    });
    const snoopEmoji = getCustomEmojiCode('snoop');
    sendEmbed(interaction, snoopEmbed, snoopEmoji);
  },
};
