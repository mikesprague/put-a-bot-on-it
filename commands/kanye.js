const Discord = require('discord.js');

const { getRandomNum, getRandomColor, makeApiCall } = require('../lib/helpers');
const { kanyeHeads } = require('../lib/lists');
const { kanyeApi } = require('../lib/urls');

module.exports = {
  name: 'kanye',
  description: 'Random Kanye West quote',
  args: false,
  async execute(msg, args) {
    // console.log(args);
    const apiUrl = kanyeApi();
    const kanyeData = await makeApiCall(apiUrl);
    const randomColor = getRandomColor();
    const kanyeEmbed = new Discord.MessageEmbed()
      .setColor(randomColor)
      .setThumbnail(kanyeHeads[getRandomNum(kanyeHeads.length)])
      .setTitle(kanyeData.quote);
    msg.channel.send(kanyeEmbed);
  },
};
