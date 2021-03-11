const Discord = require('discord.js');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

const defaultTimezone = 'America/New_York';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault(defaultTimezone);

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
      .setImage(catGif)
      .setDescription(`**${catFact.text}**`)
      .setFooter(
        `${msg.author.username} requested ?catfact at ${dayjs(
          msg.createdTimestamp,
        ).format('h:mm a')}`,
        msg.author.avatarURL(),
      );
    await msg.channel.send(catFactEmbed);
    msg.delete().catch((error) => console.error(error));
  },
};
