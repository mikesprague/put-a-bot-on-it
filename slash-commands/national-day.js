const { SlashCommandBuilder } = require('@discordjs/builders');
const {
  getGifs,
  getRandomNum,
  getRandomColor,
  makeApiCall,
  prepareEmbed,
  sendEmbed,
} = require('../lib/helpers');
const { nationalDayApi } = require('../lib/urls');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('national-day')
    .setDescription(
      'Random national day from National Day Calendar with possibly related GIF from Giphy API',
    ),
  async execute(interaction) {
    const apiUrl = nationalDayApi();
    const randomColor = getRandomColor();
    const nationalDayData = await makeApiCall(apiUrl);
    const randomNum = getRandomNum(nationalDayData.length);
    const { title, description, link } = nationalDayData[Number(randomNum)];
    
    let searchTermArray = title.split(' ');
    const startTermsToRemove = ['national'];
    if (startTermsToRemove.includes(searchTermArray[0].trim().toLowerCase())) {
      searchTermArray.shift();
    }
    const endTermsToRemove = ['day', 'eve'];
    if (endTermsToRemove.includes(searchTermArray[searchTermArray.length - 1].trim().toLowerCase())) {
      searchTermArray.pop();
    }
    const searchTerm = searchTermArray.join(' ').toLowerCase().replace('national', '');
    
    const nationalDayGifs = await getGifs({ searchTerm });
    const randomGifNum = getRandomNum(nationalDayGifs.length);
    const randomGif = nationalDayGifs[Number(randomGifNum)].images.original.url;
    console.log(link.replace('http://', 'https://'));
    const nationalDayEmbed = prepareEmbed({
      embedColor: randomColor,
      embedDescription: `[${title}](${link.replace('http://', 'https://')})`,
      embedImage: randomGif,
      embedUrl: link.replace('http://', 'https://'),
      embedFooter: description,
    });
    return sendEmbed(interaction, nationalDayEmbed);
  },
};
