const {
  getGifs,
  getRandomColor,
  getRandomNum,
  makeApiCall,
  prepareEmbed,
  sendContent,
} = require('../lib/helpers');
const { breakingBadQuotesApi } = require('../lib/urls');

module.exports = {
  name: 'breakingbad',
  description: 'Random Breaking Bad quote',
  args: false,
  async execute(msg, args) {
    const argAliases = ['large', 'full'];
    const isLarge =
      args.length && argAliases.includes(args[0].trim().toLowerCase());
    const apiUrl = breakingBadQuotesApi();
    const apiData = await makeApiCall(apiUrl);
    let allGifs = await getGifs({
      searchTerm: apiData[0].author.toLowerCase(),
      stickerSearch: true,
    });
    if (!allGifs.length || allGifs.length < 10) {
      allGifs = await getGifs({
        searchTerm: 'breaking bad',
        stickerSearch: false,
      });
    }
    const randomNum = getRandomNum(allGifs.length);
    const randomColor = getRandomColor();
    const randomSticker = allGifs[Number(randomNum)].images.original.url;
    const embed = prepareEmbed({
      command: isLarge ? `${this.name} large` : this.name,
      msg,
      embedColor: randomColor,
      embedDescription: `${apiData[0].quote}\n - ${apiData[0].author}`,
      embedImage: isLarge ? randomSticker : '',
      embedThumbnail: isLarge ? '' : randomSticker,
    });
    sendContent(msg, embed);
  },
};
