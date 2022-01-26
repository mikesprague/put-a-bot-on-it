const { SlashCommandBuilder } = require('@discordjs/builders');

const {
  getRandomColor,
  getRandomNum,
  getGifs,
  prepareEmbed,
  sendEmbed,
} = require('../lib/helpers');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('steve')
    .setDescription('Random Steve Harvey gif')
    .addStringOption((option) =>
      option.setName('query').setDescription('Enter optional search query'),
    ),
  async execute(interaction) {
    const arg = interaction.options.getString('query');
    const useArg = Boolean(arg && arg.trim().length);
    const searchTerm = useArg ? `steve harvey ${arg}` : 'steve harvey';
    const steveGifs = await getGifs({ searchTerm });
    const randomNum = useArg
      ? Math.max(steveGifs.length, 10)
      : getRandomNum(steveGifs.length);
    const embedImage = steveGifs[Number(randomNum)].images.original.url;
    const embedColor = getRandomColor();
    const steveEmbed = prepareEmbed({
      embedImage,
      embedFooter: `query: ${searchTerm}`,
      embedColor,
    });
    sendEmbed(interaction, steveEmbed);
  },
};
