const { SlashCommandBuilder } = require('@discordjs/builders');
const {
  getRandomColor,
  getRandomGifByTerm,
  makeApiCall,
  prepareEmbed,
  sendEmbed,
} = require('../lib/helpers');
const { thisForThatApi } = require('../lib/urls');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('startup')
    .setDescription('Random idea for a Startup from an API with a random GIF'),
  async execute(interaction) {
    const apiUrl = thisForThatApi();
    const apiData = await makeApiCall(apiUrl);
    const topicGif = await getRandomGifByTerm(apiData.that, false);
    const randomColor = getRandomColor();
    const startupIdea = `${apiData.this} for ${apiData.that}`;
    const startupEmbed = prepareEmbed({
      embedTitle: startupIdea,
      embedImage: topicGif,
      embedColor: randomColor,
    });
    return sendEmbed(interaction, startupEmbed);
  },
};
