const {
  getRandomNum,
  makeApiCall,
  prepareEmbed,
  sendEmbed,
} = require('../lib/helpers');
const { xkcdApi } = require('../lib/urls');

module.exports = {
  name: 'xkcd',
  description: 'Get curent or random XKCD comic',
  args: false,
  async execute(msg, args) {
    const argAliases = ['current', 'today'];
    const arg = args[0].trim().toLowerCase();
    const isCurrent = args.length && argAliases.includes(arg);
    const randumComicNum = getRandomNum(2430);
    const apiUrl = isCurrent ? xkcdApi() : xkcdApi(randumComicNum);
    const apiData = await makeApiCall(apiUrl);

    const xkcdEmbed = prepareEmbed({
      command: isCurrent ? `${this.name} ${arg}` : this.name,
      msg,
      embedTtitle: apiData.title,
      embedUrl: `https://xkcd.com/${apiData.num}`,
      embedFooter: apiData.alt,
      embedImage: apiData.img,
    });
    sendEmbed(msg, xkcdEmbed);
  },
};
