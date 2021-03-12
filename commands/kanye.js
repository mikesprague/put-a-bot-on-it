const Discord = require('discord.js');

const { getRandomNum, makeApiCall, prepareEmbed } = require('../lib/helpers');
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
    const kanyeEmbed = prepareEmbed(
      this.name,
      msg,
      kanyeData.quote,
      kanyeHeads[getRandomNum(kanyeHeads.length)],
      true,
    );
    msg.channel
      .send(kanyeEmbed)
      .then(() => {
        msg.delete();
      })
      .catch((error) => console.error(error));
  },
};
