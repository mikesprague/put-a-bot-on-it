import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';

import { makeApiCall, sendContent } from '../lib/helpers.ts';
import { boredApi } from '../lib/urls.ts';

export default {
  data: new SlashCommandBuilder()
    .setName('bored')
    .setDescription('Get random activity ideas from an API'),
  async execute(interaction: ChatInputCommandInteraction) {
    const apiUrl = boredApi();
    const apiData = await makeApiCall(apiUrl);
    const boredContent = apiData.activity;
    // console.log(boredContent);
    return await sendContent({ interaction, content: boredContent });
  },
};
