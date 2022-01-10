const { SlashCommandBuilder } = require('@discordjs/builders');

const { makeApiCall, sendContent } = require('../lib/helpers');
const { evilInsultApi } = require('../lib/urls');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('insult')
    .setDescription('Gets a random insult from a mean API'),
  async execute(interaction) {
    const apiUrl = evilInsultApi();
    const apiData = await makeApiCall(apiUrl);
    const insultContent = apiData.insult;
    sendContent(interaction, insultContent);
  },
};
