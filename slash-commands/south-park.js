import { SlashCommandBuilder } from '@discordjs/builders';

import {
  getCustomEmojiCode,
  getRandomColor,
  getRandomNum,
  // getGifs,
  getTenorGifs,
  prepareEmbed,
  sendEmbed,
} from '../lib/helpers.js';

export default {
  data: new SlashCommandBuilder()
    .setName('southpark')
    .setDescription('Random South Park GIF from Tenor')
    .addStringOption((option) =>
      option.setName('query').setDescription('Enter optional search query'),
    ),
  async execute(interaction) {
    const arg = interaction.options.getString('query');
    const useArg = Boolean(arg && arg.trim().length);
    const searchTerm = useArg ? `south park ${arg}` : 'south park';
    const southparkGifs = await getTenorGifs({ searchTerm });
    const randomNum = useArg
      ? getRandomNum(Math.min(southparkGifs.length, 20))
      : getRandomNum(southparkGifs.length);
    const embedImage = southparkGifs[randomNum].media[0].gif.url;
    const embedColor = getRandomColor();
    const southparkEmbed = prepareEmbed({
      embedImage,
      embedFooter: useArg ? `query: ${arg}` : '',
      embedColor,
    });
    const southparkEmoji = getCustomEmojiCode('towelie');
    sendEmbed(interaction, southparkEmbed, southparkEmoji);
  },
};
