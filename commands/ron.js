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
    const apiUrl = ronSwansonApi();
    const apiData = await makeApiCall(apiUrl);
    const allGifs = await getGifs('ron swanson');
    const randomNum = getRandomNum(allGifs.length);
    const randomColor = getRandomColor();
    const embed = prepareEmbed({
      command: this.name,
      msg,
      embedColor: randomColor,
      embedDescription: apiData[0],
      // eslint-disable-next-line security/detect-object-injection
      embedImage: allGifs[randomNum].images.downsized.url,
    });
    sendContent(msg, embed);
  },
};
