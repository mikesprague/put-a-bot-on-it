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
    .setDescription('Random SNL Celebrity Jeopardy gif'),
  // .addStringOption((option) =>
  //   option.setName('query').setDescription('Enter optional search query'),
  // ),
  async execute(interaction) {
    // const arg = interaction.options.getString('query');
    // const searchTerm =
    //   arg && arg.trim().length ? `steve harvey ${arg}` : 'steve harvey';
    const searchTerm1 = '@snl jeopardy';
    const trebekGifs1 = await getGifs({ searchTerm: searchTerm1 });
    const searchTerm2 = 'snl celebrity jeopardy';
    const trebekGifs2 = await getGifs({ searchTerm: searchTerm2 });
    const trebekGifs = [...trebekGifs1, ...trebekGifs2];
    console.log(trebekGifs.length);
    const randomNum = getRandomNum(trebekGifs.length);
    const embedColor = getRandomColor();
    const embedImage = trebekGifs[Number(randomNum)].images.original.url;
    const trebekEmbed = prepareEmbed({ embedImage, embedColor });
    sendEmbed(interaction, trebekEmbed);
  },
};
