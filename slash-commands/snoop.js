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
    .setName('snoop')
    .setDescription('Random Snoop Dogg GIF from Giphy')
    .addStringOption((option) =>
      option.setName('query').setDescription('Enter optional search query'),
    ),
  async execute(interaction) {
    const arg = interaction.options.getString('query');
    const useArg = Boolean(arg && arg.trim().length);
    const searchTerm = useArg ? `snoop ${arg}` : 'snoop';
    const snoopGifs = await getGifs({ searchTerm });
    const randomNum = useArg
      ? getRandomNum(Math.min(snoopGifs.length, 15))
      : getRandomNum(snoopGifs.length);
    const embedColor = getRandomColor();
    const embedImage = snoopGifs[Number(randomNum)].images.original.url;
    const snoopEmbed = prepareEmbed({
      embedImage,
      embedFooter: useArg ? `query: ${arg}` : '',
      embedColor,
    });
    const snoopEmoji = getCustomEmojiCode('snoop');
    sendEmbed(interaction, snoopEmbed, snoopEmoji);
  },
};
