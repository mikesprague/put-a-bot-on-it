import { SlashCommandBuilder } from '@discordjs/builders';

import { makeApiCall, sendContent } from '../lib/helpers.js';
import { boredApi } from '../lib/urls.js';

export default {
  data: new SlashCommandBuilder()
    .setName('bored')
    .setDescription('Get random activity ideas from an API'),
  async execute(interaction) {
    const apiUrl = boredApi();
    const apiData = await makeApiCall(apiUrl);
    const boredContent = apiData.activity;
    // console.log(boredContent);
    return sendContent(interaction, boredContent);
  },
};
