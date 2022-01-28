const { SlashCommandBuilder } = require('@discordjs/builders');
const {
  getGifs,
  getRandomNum,
  getRandomColor,
  makeApiCall,
  prepareEmbed,
  sendEmbed,
} = require('../lib/helpers');
const { kanyeApi } = require('../lib/urls');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kanye')
    .setDescription(
      'Random Kanye West quote from https://kanye.rest with GIF from Giphy',
    ),
  async execute(interaction) {
    const searchTerm = 'kanye';
    const kanyeGifs = await getGifs({ searchTerm });
    // const kanyeStickers = await getGifs({ searchTerm, stickerSearch: true });
    // const allKanyeGifs = [...kanyeGifs, ...kanyeStickers];
    const apiUrl = kanyeApi();
    const randomColor = getRandomColor();
    const kanyeData = await makeApiCall(apiUrl);
    const randomNum = getRandomNum(kanyeGifs.length);
    const randomKanye = kanyeGifs[Number(randomNum)].images.original.url;
    const kanyeEmbed = prepareEmbed({
      embedColor: randomColor,
      embedDescription: kanyeData.quote,
      embedImage: randomKanye,
    });
    return sendEmbed(interaction, kanyeEmbed);
  },
};
