const { SlashCommandBuilder } = require('@discordjs/builders');

const {
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
    const searchTerm =
      arg && arg.trim().length ? `steve harvey ${arg}` : 'steve harvey';
    const steveGifs = await getGifs({ searchTerm });
    const randomNum = getRandomNum(steveGifs.length);
    const embedImage = steveGifs[Number(randomNum)].images.original.url;
    const steveEmbed = prepareEmbed({
      embedImage,
      embedFooter: searchTerm,
    });
    sendEmbed(interaction, steveEmbed);
  },
};
