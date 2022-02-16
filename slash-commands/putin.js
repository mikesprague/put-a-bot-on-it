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
    .setName('putin')
    .setDescription('Random Putin GIF from Giphy')
    .addStringOption((option) =>
      option.setName('query').setDescription('Enter optional search query'),
    ),
  async execute(interaction) {
    const arg = interaction.options.getString('query');
    const useArg = Boolean(arg && arg.trim().length);
    const searchTerm = useArg ? `putin ${arg}` : 'putin';
    const putinGifs = await getGifs({ searchTerm });
    const randomNum = useArg
      ? getRandomNum(Math.min(putinGifs.length, 10))
      : getRandomNum(putinGifs.length);
    const embedColor = getRandomColor();
    const embedImage = putinGifs[Number(randomNum)].images.original.url;
    const putinEmbed = prepareEmbed({
      embedImage,
      embedFooter: useArg ? `query: ${arg}` : '',
      embedColor,
    });
    const putinEmoji = getCustomEmojiCode('putin');
    sendEmbed(interaction, putinEmbed, putinEmoji);
  },
};