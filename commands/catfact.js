const {
  getRandomColor,
  getRandomGifByTerm,
  getRandomNum,
  makeApiCall,
  prepareEmbed,
  sendContent,
} = require('../lib/helpers');
const { catFactsApi } = require('../lib/urls');

module.exports = {
  name: 'catfact',
  description: 'Random fact from the Cat Facts API',
  args: false,
  async execute(msg, args) {
    // console.log(args);
    const apiUrl = catFactsApi();
    const apiData = await makeApiCall(apiUrl);
    const catGif = await getRandomGifByTerm('cat');
    const randomNum = getRandomNum(apiData.length);
    const randomColor = getRandomColor();
    const catFact = apiData[Number(randomNum)];
    const catFactEmbed = prepareEmbed({
      command: this.name,
      msg,
      embedDescription: catFact.text,
      embedImage: catGif,
      embedColor: randomColor,
    });
    sendContent(msg, catFactEmbed);
  },
};
