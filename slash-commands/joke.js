const { SlashCommandBuilder } = require('@discordjs/builders');

const { makeApiCall, sendContent } = require('../lib/helpers');
const { jokeApi } = require('../lib/urls');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('joke')
    .setDescription('Gets a random joke from an API'),
  async execute(interaction) {
    const apiUrl = jokeApi();
    const apiData = await makeApiCall(apiUrl);
    const { type, joke, setup, delivery } = apiData;
    const dadJokeContent =
      type === 'single' ? joke : `${setup}\n\n||${delivery}||`;
    return sendContent(interaction, dadJokeContent);
  },
};
