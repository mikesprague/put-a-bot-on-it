const { SlashCommandBuilder } = require('@discordjs/builders');
const {
  getGifs,
  getRandomColor,
  getRandomNum,
  makeApiCall,
  prepareEmbed,
  sendEmbed,
} = require('../lib/helpers');
const { ronSwansonApi } = require('../lib/urls');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ron')
    .setDescription('Random Ron Swanson quote and gif')
    .addBooleanOption((option) =>
      option.setName('large').setDescription('Use large gif?'),
    ),
  async execute(interaction) {
    const isLarge = interaction.options.getBoolean('large');
    const apiUrl = ronSwansonApi();
    const apiData = await makeApiCall(apiUrl);
    const allGifs = await getGifs({
      searchTerm: 'ron swanson',
      stickerSearch: true,
    });
    const randomNum = getRandomNum(14);
    const randomColor = getRandomColor();
    const randomSticker = allGifs[Number(randomNum)].images.downsized.url;
    const embed = prepareEmbed({
      command: isLarge ? `${this.name} large` : this.name,
      interaction,
      embedColor: randomColor,
      embedDescription: apiData[0],
      embedImage: isLarge ? randomSticker : '',
      embedThumbnail: isLarge ? '' : randomSticker,
    });
    sendEmbed(interaction, embed);
  },
};
