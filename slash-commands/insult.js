import { SlashCommandBuilder } from '@discordjs/builders';

import { makeApiCall, sendContent } from '../lib/helpers.js';
import { evilInsultApi } from '../lib/urls.js';

export default {
  data: new SlashCommandBuilder()
    .setName('insult')
    .setDescription('Gets a random insult from a mean API'),
  async execute(interaction) {
    const apiUrl = evilInsultApi();
    const apiData = await makeApiCall(apiUrl);
    const insultContent = apiData.insult;
    sendContent(interaction, insultContent);
  },
};
