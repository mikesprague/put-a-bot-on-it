import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';

import { makeApiCall, sendContent } from '../lib/helpers.ts';
import { jokeApi } from '../lib/urls.ts';

export default {
  data: new SlashCommandBuilder()
    .setName('joke')
    .setDescription('Gets a random joke from an API'),
  async execute(interaction: ChatInputCommandInteraction) {
    const apiUrl = jokeApi();
    const apiData = await makeApiCall(apiUrl);
    const { type, joke, setup, delivery } = apiData;
    const dadJokeContent =
      type === 'single' ? joke : `${setup}\n\n||${delivery}||`;
    return await sendContent({ interaction, content: dadJokeContent });
  },
};
