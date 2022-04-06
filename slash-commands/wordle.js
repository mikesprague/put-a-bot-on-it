const axios = require('axios').default;
const { SlashCommandBuilder } = require('@discordjs/builders');

const {
  getRandomNum,
  getRandomColor,
  getGifs,
  prepareEmbed,
  sendEmbed,
} = require('../lib/helpers');
const { wordleSolutionApi } = require('../lib/urls');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('wordle')
    .setDescription(`Random GIF from Giphy (searches current Wordle solution) - warning, could spoil current game`),
  async execute(interaction) {
    const apiUrl = wordleSolutionApi();
    const searchTerm = await axios.get(apiUrl).then(response => response.data);
    const wordleGifs = await getGifs({ searchTerm });
    const randomNum = getRandomNum(wordleGifs.length);
    const embedImage = wordleGifs[Number(randomNum)].images.original.url;
    await interaction.reply({ content: embedImage, ephemeral: false });
  },
};
