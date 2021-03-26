const {
  getRandomNum,
  makeApiCall,
  prepareEmbed,
  sendContent,
} = require('../lib/helpers');
const { nasaApi } = require('../lib/urls');

module.exports = {
  name: 'nasa',
  description: 'Get curent or random NASA media of the day',
  args: false,
  async execute(msg, args) {
    const { NASA_API_KEY } = process.env;
    const apiURLBase = nasaApi(NASA_API_KEY);
    const isToday = args.length && args[0].toLowerCase() === 'today';
    const apiUrlSuffix = isToday ? '' : '&count=50';
    const apiData = await makeApiCall(`${apiURLBase}${apiUrlSuffix}`);
    const randomNum = getRandomNum(apiData.length);
    const nasaColor = '#113991';
    const nasaData = isToday ? apiData : apiData[Number(randomNum)];
    const nasaEmbed = prepareEmbed({
      command: isToday ? `${this.name} today` : this.name,
      msg,
      embedColor: nasaColor,
      embedTtitle: nasaData.title,
      embedDescription: nasaData.explanation,
      embedUrl: nasaData.hdurl || nasaData.url,
      embedImage: nasaData.url,
    });
    sendContent(msg, nasaEmbed);
  },
};
