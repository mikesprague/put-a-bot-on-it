const {
  getRandomNum,
  makeApiCall,
  prepareEmbed,
  sendContent,
} = require('../lib/helpers');
const { xkcdApi } = require('../lib/urls');

module.exports = {
  name: 'xkcd',
  description: 'Get curent or random XKCD comic',
  args: false,
  async execute(msg, args) {
    const isToday = args.length && args[0].toLowerCase() === 'today';
    const randumComicNum = getRandomNum(2430);
    const apiUrl = isToday ? xkcdApi() : xkcdApi(randumComicNum);
    const apiData = await makeApiCall(apiUrl);

    const xkcdEmbed = prepareEmbed({
      command: this.name,
      msg,
      embedTtitle: apiData.title,
      embedUrl: `https://xkcd.com/${apiData.num}`,
      embedDescription: apiData.alt,
      embedImage: apiData.img,
    });
    sendContent(msg, xkcdEmbed);
  },
};
