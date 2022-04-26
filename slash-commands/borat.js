import { SlashCommandBuilder } from '@discordjs/builders';

import {
  getCustomEmojiCode,
  getRandomNum,
  getRandomColor,
  getGifs,
  prepareEmbed,
  sendEmbed,
} from '../lib/helpers.js';

export default {
  data: new SlashCommandBuilder()
    .setName('borat')
    .setDescription('Random Borat GIF from Giphy')
    .addStringOption((option) =>
      option.setName('query').setDescription('Enter optional search query'),
    ),
  async execute(interaction) {
    const arg = interaction.options.getString('query');
    const useArg = Boolean(arg && arg.trim().length);
    const searchTerm = useArg ? `borat ${arg}` : 'borat';
    const boratGifs = await getGifs({ searchTerm });
    const randomNum = useArg
      ? getRandomNum(Math.min(boratGifs.length, 10))
      : getRandomNum(boratGifs.length);
    const embedColor = getRandomColor();
    const embedImage = boratGifs[randomNum].images.original.url;
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
