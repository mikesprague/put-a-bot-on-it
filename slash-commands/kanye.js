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
      'Random Kanye West quote from https://kanye.rest and GIF from Giphy',
    )
    .addStringOption((option) =>
      option.setName('query').setDescription('Enter optional search query'),
    ),
  async execute(interaction) {
    const arg = interaction.options.getString('query');
    const useArg = Boolean(arg && arg.trim().length);
    const searchTerm = useArg ? `kanye ${arg}` : 'kanye';
    const kanyeGifs = await getGifs({ searchTerm });
    const kanyeStickers = await getGifs({ searchTerm, stickerSearch: true });
    const allKanyeGifs = [...kanyeGifs, ...kanyeStickers];
    const apiUrl = kanyeApi();
    const randomColor = getRandomColor();
    const kanyeData = await makeApiCall(apiUrl);
    const randomNum = useArg
      ? getRandomNum(Math.min(allKanyeGifs.length, 15))
      : getRandomNum(allKanyeGifs.length);
    const randomKanye = allKanyeGifs[randomNum];
    const kanyeEmbed = prepareEmbed({
      embedColor: randomColor,
      embedDescription: kanyeData.quote,
      embedImage: randomKanye,
      embedFooter: useArg ? `query: ${arg}` : '',
    });
    return sendEmbed(interaction, kanyeEmbed);
  },
};
