import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';

import { makeApiCall, sendContent } from '../lib/helpers.ts';
import { dadJokeApi } from '../lib/urls.ts';

export default {
  data: new SlashCommandBuilder()
    .setName('dadjoke')
    .setDescription('Get random dad joke from an API'),
  async execute(interaction: ChatInputCommandInteraction) {
    const apiUrl = dadJokeApi();
    const apiData = await makeApiCall(apiUrl, 'GET', {
      Accept: 'application/json',
      'Accept-Encoding': 'gzip, deflate',
      'User-Agent': 'BirdBot (Discord.js bot on private server)',
    });
    const dadJokeContent = apiData.joke;
    return await sendContent({ interaction, content: dadJokeContent });
  },
};
