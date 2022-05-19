import { SlashCommandBuilder } from '@discordjs/builders';

import {
  getCustomEmojiCode,
  getRandomNum,
  getRandomColor,
  // getGiphyGifs,
  getTenorGifs,
  prepareEmbed,
  sendEmbed,
} from '../../lib/helpers.js';

export default {
  data: new SlashCommandBuilder()
    .setName('alf')
    .setDescription('Random Alf GIF from Tenor')
    .addStringOption((option) =>
      option.setName('query').setDescription('Enter optional search query'),
    ),
  async execute(interaction) {
    const arg = interaction.options.getString('query');
    const useArg = Boolean(arg && arg.trim().length);
    const searchTerm = useArg ? `alf ${arg}` : 'alf';
    // const alfGifs = await getGiphyGifs({ searchTerm });
    const alfGifs = await getTenorGifs({ searchTerm });
    const randomNum = useArg
      ? getRandomNum(Math.min(alfGifs.length, 20))
      : getRandomNum(alfGifs.length);
    const embedColor = getRandomColor();
    // const embedImage = alfGifs[randomNum].images.original.url;
    const embedImage = alfGifs[randomNum].media[0].gif.url;
    console.log(embedImage);
    const alfEmbed = prepareEmbed({
      embedImage,
      embedFooter: useArg ? `query: ${arg}` : '',
      embedColor,
    });
    const alfEmoji = getCustomEmojiCode('alf');
    sendEmbed(interaction, alfEmbed, alfEmoji);
  },
};
