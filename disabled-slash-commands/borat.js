import { SlashCommandBuilder } from '@discordjs/builders';

import {
  getCustomEmojiCode,
  getRandomNum,
  getRandomColor,
  getGiphyGifs,
  getTenorGifs,
  prepareEmbed,
  sendEmbed,
} from '../lib/helpers.js';

export default {
  data: new SlashCommandBuilder()
    .setName('borat')
    .setDescription('Random Borat GIF from Tenor')
    .addStringOption((option) =>
      option.setName('query').setDescription('Enter optional search query'),
    ),
  async execute(interaction) {
    const arg = interaction.options.getString('query');
    const useArg = Boolean(arg && arg.trim().length);
    const searchTerm = useArg ? `borat ${arg}` : 'borat';
    // const boratGifs = await getGiphyGifs({ searchTerm });
    const boratGifs = await getTenorGifs({ searchTerm });
    const randomNum = useArg
      ? getRandomNum(Math.min(boratGifs.length, 20))
      : getRandomNum(boratGifs.length);
    const embedColor = getRandomColor();
    // const embedImage = boratGifs[randomNum].images.original.url;
    const embedImage = boratGifs[randomNum].media[0].gif.url;
    const boratEmbed = prepareEmbed({
      embedImage,
      embedFooter: useArg ? `query: ${arg}` : '',
      embedColor,
    });
    const emojiStrings = ['borat', 'great_success'];
    const boratEmoji = getCustomEmojiCode(
      emojiStrings[getRandomNum(emojiStrings.length)],
    );
    sendEmbed(interaction, boratEmbed, boratEmoji);
  },
};
