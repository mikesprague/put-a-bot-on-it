const { SlashCommandBuilder } = require('@discordjs/builders');

const {
  getRandomColor,
  getRandomNum,
  getGifs,
  prepareEmbed,
  sendEmbed,
} = require('../lib/helpers');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('trebek')
    .setDescription('Random SNL Celebrity Jeopardy gif')
    .addStringOption((option) =>
      option.setName('query').setDescription('Enter optional search query'),
    ),
  async execute(interaction) {
    const arg = interaction.options.getString('query');
    const useArg = Boolean(arg && arg.trim().length);
    const searchTerm1 = useArg ? `@snl jeopardy ${arg}` : '@snl jeopardy';
    const searchTerm2 = useArg
      ? `snl celebrity jeopardy ${arg}`
      : 'snl celebrity jeopardy';
    const trebekGifs1 = await getGifs({ searchTerm: searchTerm1 });
    const trebekGifs2 = await getGifs({ searchTerm: searchTerm2 });
    const trebekGifs = [...trebekGifs1, ...trebekGifs2];
    const randomNum = useArg
      ? getRandomNum(Math.min(trebekGifs.length, 5))
      : getRandomNum(trebekGifs.length);
    const embedColor = getRandomColor();
    const embedImage = trebekGifs[randomNum].images.original.url;
    const trebekEmbed = prepareEmbed({
      embedImage,
      embedFooter: useArg ? `query: ${arg}` : '',
      embedColor,
    });
    sendEmbed(interaction, trebekEmbed);
  },
};
