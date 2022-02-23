const { SlashCommandBuilder } = require('@discordjs/builders');

const {
  getCustomEmojiCode,
  getRandomNum,
  getRandomColor,
  getGifs,
  prepareEmbed,
  sendEmbed,
} = require('../lib/helpers');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('star-wars')
    .setDescription('Random Star Wars GIF from Giphy')
    .addStringOption((option) =>
      option.setName('query').setDescription('Enter optional search query'),
    ),
  async execute(interaction) {
    const arg = interaction.options.getString('query');
    const useArg = Boolean(arg && arg.trim().length);
    const searchTerm = useArg ? `star wars ${arg}` : 'star wars';
    const starWarsGifs = await getGifs({ searchTerm });
    const randomNum = useArg
      ? getRandomNum(Math.min(starWarsGifs.length, 10))
      : getRandomNum(starWarsGifs.length);
    const embedColor = getRandomColor();
    const embedImage = starWarsGifs[Number(randomNum)].images.original.url;
    const starWarsEmbed = prepareEmbed({
      embedImage,
      embedFooter: useArg ? `query: ${arg}` : '',
      embedColor,
    });
    const emojiArray = ['darth_vader', 'yoda'];
    const starWarsEmoji = getCustomEmojiCode(emojiArray[getRandomNum(emojiArray.length)]);
    return sendEmbed(interaction, starWarsEmbed, starWarsEmoji);
  },
};
