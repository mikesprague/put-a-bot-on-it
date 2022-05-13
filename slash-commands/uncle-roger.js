import { SlashCommandBuilder } from '@discordjs/builders';

import {
  getCustomEmojiCode,
  getRandomNum,
  getRandomColor,
  // getGifs,
  getTenorGifs,
  prepareEmbed,
  sendEmbed,
} from '../lib/helpers.js';

export default {
  data: new SlashCommandBuilder()
    .setName('uncle-roger')
    .setDescription('Random UNcle Roger GIF from Tenor')
    .addStringOption((option) =>
      option.setName('query').setDescription('Enter optional search query'),
    ),
  async execute(interaction) {
    const arg = interaction.options.getString('query');
    const useArg = Boolean(arg && arg.trim().length);
    const searchTerm = useArg ? `uncle roger ${arg}` : 'uncle roger';
    // const uncleRogerGifs = await getGifs({ searchTerm });
    const uncleRogerGifs = await getTenorGifs({ searchTerm });
    const randomNum = useArg
      ? getRandomNum(Math.min(uncleRogerGifs.length, 20))
      : getRandomNum(uncleRogerGifs.length);
    const embedColor = getRandomColor();
    // const embedImage = uncleRogerGifs[randomNum].images.original.url;
    const embedImage = uncleRogerGifs[randomNum].media[0].gif.url;
    const uncleRogerEmbed = prepareEmbed({
      embedImage,
      embedFooter: useArg ? `query: ${arg}` : '',
      embedColor,
    });
    const uncleRogerEmoji = getCustomEmojiCode('uncle_roger');
    sendEmbed(interaction, uncleRogerEmbed, uncleRogerEmoji);
  },
};
