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
    .setName('rick-morty')
    .setDescription('Random Rick and Morty GIF from Tenor')
    .addStringOption((option) =>
      option.setName('query').setDescription('Enter optional search query'),
    ),
  async execute(interaction) {
    const arg = interaction.options.getString('query');
    const useArg = Boolean(arg && arg.trim().length);
    const searchTerm = useArg ? `rick and morty ${arg}` : 'rick and morty';
    const rickAndMortyGifs = await getTenorGifs({ searchTerm });
    const randomNum = useArg
      ? getRandomNum(Math.min(rickAndMortyGifs.length, 20))
      : getRandomNum(rickAndMortyGifs.length);
    const embedImage = rickAndMortyGifs[randomNum].media[0].gif.url;
    const embedColor = getRandomColor();
    const rickAndMortyEmbed = prepareEmbed({
      embedImage,
      embedFooter: useArg ? `query: ${arg}` : '',
      embedColor,
    });
    const emojiStrings = ['rick', 'morty', 'portal'];
    const rickAndMortyEmoji = getCustomEmojiCode(
      emojiStrings[getRandomNum(emojiStrings.length)],
    );
    sendEmbed(interaction, rickAndMortyEmbed, rickAndMortyEmoji);
  },
};
