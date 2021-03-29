const {
  getGifs,
  getRandomColor,
  getRandomNum,
  makeApiCall,
  prepareEmbed,
  sendContent,
} = require('../lib/helpers');
const { ronSwansonApi } = require('../lib/urls');

module.exports = {
  name: 'ron',
  description: 'Random Ron Swanson quote',
  args: false,
  aliases: ['ronswanson', 'swanson'],
  async execute(msg, args) {
    const argAliases = ['large', 'full'];
    const isLarge =
      args.length && argAliases.includes(args[0].trim().toLowerCase());
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
      msg,
      embedColor: randomColor,
      embedDescription: apiData[0],
      embedImage: isLarge ? randomSticker : '',
      embedThumbnail: isLarge ? '' : randomSticker,
    });
    sendContent(msg, embed);
  },
};
