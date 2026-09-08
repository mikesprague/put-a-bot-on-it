import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';

import { makeApiCall, sendContent } from '../lib/helpers.ts';
import { affirmationApi } from '../lib/urls.ts';

export default {
  data: new SlashCommandBuilder()
    .setName('affirmation')
    .setDescription('Get an affirmation from an API'),
  async execute(interaction: ChatInputCommandInteraction) {
    const apiUrl = affirmationApi();
    const apiData = (await makeApiCall(apiUrl)) as { affirmation: string };
    const { affirmation } = apiData;
    return await sendContent({ interaction, content: affirmation });
  },
};
