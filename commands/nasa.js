const Discord = require('discord.js');

const { getRandomNum, makeApiCall } = require('../lib/helpers');
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
    // eslint-disable-next-line security/detect-object-injection
    const nasaData = isToday ? apiData : apiData[randomNum];

    const nasaEmbed = new Discord.MessageEmbed()
      .setColor('#113991')
      .setTitle(nasaData.title)
      .setURL(nasaData.hdurl || nasaData.url)
      .setDescription(nasaData.explanation)
      .setImage(nasaData.url);
    msg.channel.send(nasaEmbed);
  },
};
