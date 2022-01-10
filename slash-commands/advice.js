const { SlashCommandBuilder } = require('@discordjs/builders');

const { makeApiCall, sendContent } = require('../lib/helpers');
const { adviceApi } = require('../lib/urls');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('advice')
    .setDescription('Get random advice from an API'),
  async execute(interaction) {
    const apiUrl = adviceApi();
    const apiData = await makeApiCall(apiUrl);
    const adviceContent = apiData.slip.advice;
    return sendContent(interaction, adviceContent);
  },
};
