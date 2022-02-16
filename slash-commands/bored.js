const { SlashCommandBuilder } = require('@discordjs/builders');

const { makeApiCall, sendContent } = require('../lib/helpers');
const { boredApi } = require('../lib/urls');

module.exports = {
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
