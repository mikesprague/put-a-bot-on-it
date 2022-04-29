import { SlashCommandBuilder } from '@discordjs/builders';

import {
  getCustomEmojiCode,
  getRandomNum,
  getRandomColor,
  getGifs,
  getTenorGifs,
  prepareEmbed,
  sendEmbed,
} from '../lib/helpers.js';

export default {
  data: new SlashCommandBuilder()
    .setName('wu-tang')
    .setDescription('Random Wu-Tang Clan GIF from Giphy')
    .addStringOption((option) =>
      option.setName('query').setDescription('Enter optional search query'),
    ),
  async execute(interaction) {
    const arg = interaction.options.getString('query');
    const useArg = Boolean(arg && arg.trim().length);
    const searchTerm = useArg ? `wu-tang ${arg}` : 'wu-tang';
    // const wuTangGifs = await getGifs({ searchTerm });
    const wuTangGifs = await getTenorGifs({ searchTerm });
    const randomNum = useArg
      ? getRandomNum(Math.min(wuTangGifs.length, 15))
      : getRandomNum(wuTangGifs.length);
    const embedColor = getRandomColor();
    // const embedImage = wuTangGifs[randomNum].images.original.url;
    const embedImage = wuTangGifs[randomNum].media[0].gif.url;
    const wuTangEmbed = prepareEmbed({
      embedImage,
      embedFooter: useArg ? `query: ${arg}` : '',
      embedColor,
    });
    const wuTangEmoji = getCustomEmojiCode('wutang');
    sendEmbed(interaction, wuTangEmbed, wuTangEmoji);
  },
};
