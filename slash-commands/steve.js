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
    .setName('steve')
    .setDescription('Random Steve Harvey GIF from Tenor')
    .addStringOption((option) =>
      option.setName('query').setDescription('Enter optional search query'),
    ),
  async execute(interaction) {
    const arg = interaction.options.getString('query');
    const useArg = Boolean(arg && arg.trim().length);
    const searchTerm = useArg ? `steve harvey ${arg}` : 'steve harvey';
    // const steveGifs = await getGifs({ searchTerm });
    const steveGifs = await getTenorGifs({ searchTerm });
    const randomNum = useArg
      ? getRandomNum(Math.min(steveGifs.length, 20))
      : getRandomNum(steveGifs.length);
    // const embedImage = steveGifs[randomNum].images.original.url;
    const embedImage = steveGifs[randomNum].media[0].gif.url;
    const embedColor = getRandomColor();
    const steveEmbed = prepareEmbed({
      embedImage,
      embedFooter: useArg ? `query: ${arg}` : '',
      embedColor,
    });
    const steveEmoji = getCustomEmojiCode('steve');
    sendEmbed(interaction, steveEmbed, steveEmoji);
  },
};
