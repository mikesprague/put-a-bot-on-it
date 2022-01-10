const { SlashCommandBuilder } = require('@discordjs/builders');
const {
  getRandomNum,
  getRandomColor,
  makeApiCall,
  prepareEmbed,
  sendEmbed,
} = require('../lib/helpers');
const { kanyeHeads } = require('../lib/lists');
const { kanyeApi } = require('../lib/urls');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kanye')
    .setDescription('Random Kanye West quote from https://kanye.rest')
    .addBooleanOption((option) =>
      option.setName('large').setDescription('Use large gif?'),
    ),
  async execute(interaction) {
    const isLarge = interaction.options.getBoolean('large');
    const apiUrl = kanyeApi();
    const randomColor = getRandomColor();
    const kanyeData = await makeApiCall(apiUrl);
    const randomKanye = kanyeHeads[getRandomNum(kanyeHeads.length)];
    const kanyeEmbed = prepareEmbed({
      embedColor: randomColor,
      embedDescription: kanyeData.quote,
      embedThumbnail: isLarge ? '' : randomKanye,
      embedImage: isLarge ? randomKanye : '',
    });
    return sendEmbed(interaction, kanyeEmbed);
  },
};
