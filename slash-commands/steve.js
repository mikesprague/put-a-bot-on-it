const { SlashCommandBuilder } = require('@discordjs/builders');

const { getRandomNum, getGifs, prepareEmbed } = require('../lib/helpers');

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
    });
    try {
      await interaction.reply({ embeds: [steveEmbed] });
      const message = await interaction.fetchReply();
      const newSteveEmbed = steveEmbed.setFooter(searchTerm);
      await message.edit(newSteveEmbed);
    } catch (error) {
      console.error('💀 There was an error executing steve: \n', error);
    }
  },
};
