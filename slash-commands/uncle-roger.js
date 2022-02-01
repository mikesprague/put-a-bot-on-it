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
    .setName('uncle-roger')
    .setDescription('Random UNcle Roger GIF from Giphy')
    .addStringOption((option) =>
      option.setName('query').setDescription('Enter optional search query'),
    ),
  async execute(interaction) {
    const arg = interaction.options.getString('query');
    const useArg = Boolean(arg && arg.trim().length);
    const searchTerm = useArg ? `uncle roger ${arg}` : 'uncle roger';
    const uncleRogerGifs = await getGifs({ searchTerm });
    const randomNum = useArg
      ? getRandomNum(Math.min(uncleRogerGifs.length, 10))
      : getRandomNum(uncleRogerGifs.length);
    const embedColor = getRandomColor();
    const embedImage = uncleRogerGifs[Number(randomNum)].images.original.url;
    const uncleRogerEmbed = prepareEmbed({
      embedImage,
      embedFooter: useArg ? `query: ${arg}` : '',
      embedColor,
    });
    sendEmbed(interaction, uncleRogerEmbed);
  },
};
