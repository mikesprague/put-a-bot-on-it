const Discord = require('discord.js');

const { getRandomNum, makeApiCall } = require('../lib/helpers');
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

    const xkcdEmbed = new Discord.MessageEmbed()
      .setTitle(apiData.title)
      .setURL(`https://xkcd.com/${apiData.num}`)
      .setImage(apiData.img)
      .setFooter(apiData.alt);
    msg.channel.send(xkcdEmbed);
  },
};
