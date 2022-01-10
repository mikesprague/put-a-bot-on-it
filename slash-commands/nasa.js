const { SlashCommandBuilder } = require('@discordjs/builders');
const {
  getRandomNum,
  makeApiCall,
  prepareEmbed,
  sendEmbed,
} = require('../lib/helpers');
const { nasaApi } = require('../lib/urls');

module.exports = {
  name: 'nasa',
  description: 'Get curent or random NASA media of the day',
  args: false,
  data: new SlashCommandBuilder()
    .setName('nasa')
    .setDescription('Get curent or random NASA media of the day')
    .addBooleanOption((option) =>
      option.setName('today').setDescription('True for today/Fasle for random'),
    ),
  async execute(interaction) {
    const { NASA_API_KEY } = process.env;
    const apiURLBase = nasaApi(NASA_API_KEY);
    const isToday = interaction.options.getBoolean('today');
    const apiUrlSuffix = isToday ? '' : '&count=50';
    const apiData = await makeApiCall(`${apiURLBase}${apiUrlSuffix}`);
    const randomNum = getRandomNum(apiData.length);
    const nasaColor = '#113991';
    const nasaData = isToday ? apiData : apiData[Number(randomNum)];
    const nasaEmbed = prepareEmbed({
      embedColor: nasaColor,
      embedTtitle: nasaData.title,
      embedDescription: nasaData.explanation,
      embedUrl: nasaData.hdurl || nasaData.url,
      embedImage: nasaData.url,
    });
    sendEmbed(interaction, nasaEmbed);
  },
};
