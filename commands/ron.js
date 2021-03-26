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
  async execute(msg, args) {
    const isLarge =
      args.length && args[0].length && args[0].toLowerCase() === 'large';
    const apiUrl = ronSwansonApi();
    const apiData = await makeApiCall(apiUrl);
    const allGifs = await getGifs({
      searchTerm: 'ron swanson',
      stickerSearch: true,
    });
    const randomNum = getRandomNum(14);
    const randomColor = getRandomColor();
    const randomSticker = allGifs[randomNum].images.downsized.url;
    const embed = prepareEmbed({
      command: isLarge ? `${this.name} large` : this.name,
      msg,
      embedColor: randomColor,
      embedDescription: apiData[0],
      // eslint-disable-next-line security/detect-object-injection
      embedImage: isLarge ? randomSticker : '',
      embedThumbnail: isLarge ? '' : randomSticker,
    });
    sendContent(msg, embed);
  },
};
