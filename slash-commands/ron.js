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
    .addStringOption((option) =>
      option
        .setName('size')
        .setDescription('The gif size')
        .setRequired(true)
        .addChoice('large', 'large')
        .addChoice('small', 'small'),
    ),
  async execute(interaction) {
    const isLarge = interaction.options.getString('size') === 'large';
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
      embedColor: randomColor,
      embedDescription: apiData[0],
      embedImage: isLarge ? randomSticker : '',
      embedThumbnail: isLarge ? '' : randomSticker,
    });
    return sendEmbed(interaction, embed);
  },
};
