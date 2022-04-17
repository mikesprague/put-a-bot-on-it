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
      'Random national day from National Day Calendar (with possibly related GIF from Giphy API)',
    ),
  async execute(interaction) {
    const apiUrl = nationalDayApi();
    const randomColor = getRandomColor();
    const nationalDayData = await makeApiCall(apiUrl);
    const randomNum = getRandomNum(nationalDayData.length);
    const { title, description, link } = nationalDayData[randomNum];

    let searchTermArray = title.split(' ');
    const startTermsToRemove = ['national'];
    if (startTermsToRemove.includes(searchTermArray[0].trim().toLowerCase())) {
      searchTermArray.shift();
    }
    const endTermsToRemove = ['day', 'eve'];
    if (
      endTermsToRemove.includes(
        searchTermArray[searchTermArray.length - 1].trim().toLowerCase(),
      )
    ) {
      searchTermArray.pop();
    }
    const searchTerm = searchTermArray
      .join(' ')
      .toLowerCase()
      .replace('national', '');
    const nationalDayGifs = await getGifs({ searchTerm });
    const randomGifNum = getRandomNum(nationalDayGifs.length);
    const randomGif = nationalDayGifs[randomGifNum].images.original.url;
    const nationalDayEmbed = prepareEmbed({
      embedTitle: title,
      embedColor: randomColor,
      embedDescription: `${description} ...[read more](${link})`,
      embedImage: randomGif,
      embedUrl: link,
    });
    return sendEmbed(interaction, nationalDayEmbed);
  },
};
