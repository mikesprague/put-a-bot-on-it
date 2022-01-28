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
    .setDescription('Random Ron Swanson quote from an API with GIF from Giphy'),
  async execute(interaction) {
    const apiUrl = ronSwansonApi();
    const searchTerm = 'ron swanson';
    const apiData = await makeApiCall(apiUrl);
    const ronGifs = await getGifs({ searchTerm });
    const ronStickers = await getGifs({ searchTerm, stickerSearch: true });
    const allGifs = [...ronGifs, ...ronStickers];
    const randomNum = getRandomNum(allGifs.length);
    const randomColor = getRandomColor();
    const randomRon = allGifs[Number(randomNum)].images.downsized.url;
    const embed = prepareEmbed({
      embedColor: randomColor,
      embedDescription: apiData[0],
      embedImage: randomRon,
    });
    return sendEmbed(interaction, embed);
  },
};
