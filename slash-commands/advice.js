const { SlashCommandBuilder } = require('@discordjs/builders');

const {
  // getRandomColor,
  makeApiCall,
  // prepareEmbed,
  sendContent,
} = require('../lib/helpers');
const { adviceApi } = require('../lib/urls');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('advice')
    .setDescription('Get random advice from an API'),
  async execute(interaction) {
    const apiUrl = adviceApi();
    const apiData = await makeApiCall(apiUrl);
    // const randomColor = getRandomColor();
    const adviceContent = apiData.slip.advice;
    // const adviceEmbed = prepareEmbed({
    //   command: this.name,
    //   interaction,
    //   embedDescription: adviceContent,
    //   embedColor: randomColor,
    // });
    return sendContent(interaction, adviceContent);
  },
};
