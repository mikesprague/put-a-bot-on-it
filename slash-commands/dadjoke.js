const { SlashCommandBuilder } = require('@discordjs/builders');

const { makeApiCall, sendContent } = require('../lib/helpers');
const { dadJokeApi } = require('../lib/urls');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('dadjoke')
    .setDescription('Get random dad joke from an API'),
  async execute(interaction) {
    const apiUrl = dadJokeApi();
    const apiData = await makeApiCall(apiUrl, 'GET', {
      Accept: 'application/json',
      'User-Agent': 'BirdBot (Discord.js bot on private server)',
    });
    const dadJokeContent = apiData.joke;
    return sendContent(interaction, dadJokeContent);
  },
};
