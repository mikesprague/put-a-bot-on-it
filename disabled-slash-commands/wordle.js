import axios from 'axios';
import { SlashCommandBuilder } from '@discordjs/builders';

import { getRandomNum, getGifs, getTenorGifs } from '../lib/helpers.js';
import { wordleSolutionApi } from '../lib/urls.js';

export default {
  data: new SlashCommandBuilder()
    .setName('wordle')
    .setDescription(
      `Random GIF from Tenor based on current Wordle solution - warning, could spoil current game`,
    ),
  async execute(interaction) {
    const apiUrl = wordleSolutionApi();
    const searchTerm = await axios
      .get(apiUrl)
      .then((response) => response.data)
      .catch(async (error) => {
        const searchTerm = await axios
          .get(apiUrl)
          .then((response) => response.data)
          .catch((error) => console.error(error));

        return searchTerm;
      });
    // const wordleGifs = await getGifs({ searchTerm });
    const wordleGifs = await getTenorGifs({ searchTerm });
    const randomNum = getRandomNum(wordleGifs.length);
    // const embedImage = wordleGifs[randomNum].images.original.url;
    const embedImage = wordleGifs[randomNum].media[0].gif.url;
    await interaction.reply({ content: embedImage, ephemeral: false });
  },
};
