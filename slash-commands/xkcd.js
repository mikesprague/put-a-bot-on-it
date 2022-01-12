const { SlashCommandBuilder } = require('@discordjs/builders');
const {
  getRandomNum,
  makeApiCall,
  prepareEmbed,
  sendEmbed,
} = require('../lib/helpers');
const { xkcdApi } = require('../lib/urls');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('xkcd')
    .setDescription('Get curent or random XKCD comic')
    .addStringOption((option) =>
      option
        .setName('comic')
        .setDescription('Latest or random')
        .setRequired(true)
        .addChoice('latest', 'latest')
        .addChoice('random', 'random'),
    ),
  async execute(interaction) {
    const isCurrent = interaction.options.getString('comic') === 'latest';
    const randumComicNum = getRandomNum(2430);
    const apiUrl = isCurrent ? xkcdApi() : xkcdApi(randumComicNum);
    const apiData = await makeApiCall(apiUrl);

    const xkcdEmbed = prepareEmbed({
      embedTtitle: apiData.title,
      embedUrl: `https://xkcd.com/${apiData.num}`,
      embedFooter: apiData.alt,
      embedImage: apiData.img,
    });
    sendEmbed(interaction, xkcdEmbed);
  },
};
