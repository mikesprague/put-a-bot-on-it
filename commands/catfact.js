const Discord = require('discord.js');

const {
  getRandomNum,
  getRandomColor,
  getRandomGifByTerm,
  makeApiCall,
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
    const catFact =
      // eslint-disable-next-line security/detect-object-injection
      apiData[randomNum].text.length > 256
        ? apiData[getRandomNum(apiData.length)]
        : // eslint-disable-next-line security/detect-object-injection
          apiData[randomNum];
    const catFactEmbed = new Discord.MessageEmbed()
      .setColor(randomColor)
      .setThumbnail(catGif)
      .setTitle(catFact.text);
    msg.channel.send(catFactEmbed);
  },
};
