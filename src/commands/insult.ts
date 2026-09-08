import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';

import { makeApiCall, sendContent } from '../lib/helpers.ts';
import { evilInsultApi } from '../lib/urls.ts';

export default {
  data: new SlashCommandBuilder()
    .setName('insult')
    .setDescription('Gets a random insult from a mean API'),
  async execute(interaction: ChatInputCommandInteraction) {
    const apiUrl = evilInsultApi();
    const apiData = await makeApiCall(apiUrl, 'GET', {
      Accept: 'application/json',
      'Accept-Encoding': 'gzip, deflate',
      'User-Agent': 'BirdBot (Discord.js bot on private server)',
    });
    const insultContent = apiData.insult;
    return await sendContent({ interaction, content: insultContent });
  },
};
