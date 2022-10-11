import { SlashCommandBuilder } from 'discord.js';

import { makeApiCall, sendContent } from '../lib/helpers.js';
import { adviceApi } from '../lib/urls.js';

export default {
  data: new SlashCommandBuilder()
    .setName('advice')
    .setDescription('Get random advice from an API'),
  async execute(interaction) {
    const apiUrl = adviceApi();
    const apiData = await makeApiCall(apiUrl);
    const adviceContent = apiData.slip.advice;
    return await sendContent({ interaction, content: adviceContent });
  },
};
