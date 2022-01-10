const { SlashCommandBuilder } = require('@discordjs/builders');
const {
  getRandomColor,
  getRandomGifByTerm,
  getRandomNum,
  makeApiCall,
  prepareEmbed,
  sendEmbed,
} = require('../lib/helpers');
const { catFactsApi } = require('../lib/urls');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('catfact')
    .setDescription('Random fact from the Cat Facts API'),
  async execute(interaction) {
    const apiUrl = catFactsApi();
    const apiData = await makeApiCall(apiUrl, 'GET', {
      Accept: 'application/json',
      'User-Agent': 'BirdBot (Discord.js bot on private server)',
    }).then((response) => response.data);
    const catGif = await getRandomGifByTerm('cat', false);
    const randomNum = getRandomNum(apiData.length);
    const randomColor = getRandomColor();
    const catFact = apiData[Number(randomNum)];
    const catFactEmbed = prepareEmbed({
      command: this.name,
      interaction,
      embedDescription: catFact.fact,
      embedImage: catGif,
      embedColor: randomColor,
    });
    return sendEmbed(interaction, catFactEmbed);
  },
};
