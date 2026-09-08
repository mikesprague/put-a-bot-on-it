import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';

import { makeApiCall, sendContent } from '../lib/helpers.ts';
import { adviceApi } from '../lib/urls.ts';

export default {
  data: new SlashCommandBuilder()
    .setName('advice')
    .setDescription('Get random advice from an API'),
  async execute(interaction: ChatInputCommandInteraction) {
    const apiUrl = adviceApi();
    const apiData = await makeApiCall(apiUrl);
    const adviceContent = apiData.slip.advice;
    return await sendContent({ interaction, content: adviceContent });
  },
};
