import { SlashCommandBuilder } from 'discord.js';

import { makeApiCall, sendContent } from '../lib/helpers.js';
import { affirmationApi } from '../lib/urls.js';

export default {
  data: new SlashCommandBuilder()
    .setName('affirmation')
    .setDescription('Get an affirmation from an API'),
  async execute(interaction) {
    const apiUrl = affirmationApi();
    const apiData = await makeApiCall(apiUrl);
    const { affirmation } = apiData;
    return await sendContent({ interaction, content: affirmation });
  },
};
