import { SlashCommandBuilder } from 'discord.js';

import { makeApiCall, sendContent } from '../lib/helpers.js';
import { jokeApi } from '../lib/urls.js';

export default {
  data: new SlashCommandBuilder()
    .setName('joke')
    .setDescription('Gets a random joke from an API'),
  async execute(interaction) {
    const apiUrl = jokeApi();
    const apiData = await makeApiCall(apiUrl);
    const { type, joke, setup, delivery } = apiData;
    const dadJokeContent =
      type === 'single' ? joke : `${setup}\n\n||${delivery}||`;
    return await sendContent({ interaction, content: dadJokeContent });
  },
};
