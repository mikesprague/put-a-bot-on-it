const { SlashCommandBuilder } = require('@discordjs/builders');
const {
  getRandomColor,
  getRandomGifByTerm,
  getRandomNum,
  makeApiCall,
  prepareEmbed,
  sendEmbed,
} = require('../lib/helpers');
const { trumpApi } = require('../lib/urls');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('trump')
    .setDescription('Random Trump quote from an API with a random GIF'),
  async execute(interaction) {
    const apiUrl = trumpApi();
    const apiData = await makeApiCall(apiUrl);
    const topicGif = await getRandomGifByTerm(apiData.tags[0], false);
    const randomColor = getRandomColor();
    const trumpQuote = apiData.value;
    const trumpQuoteEmbed = prepareEmbed({
      embedDescription: trumpQuote,
      embedImage: topicGif,
      embedColor: randomColor,
    });
    return sendEmbed(interaction, trumpQuoteEmbed);
  },
};