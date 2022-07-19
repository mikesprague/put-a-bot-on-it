import { SlashCommandBuilder } from 'discord.js';

import { makeApiCall, sendContent } from '../lib/helpers.js';
import { dadJokeApi } from '../lib/urls.js';

export default {
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
