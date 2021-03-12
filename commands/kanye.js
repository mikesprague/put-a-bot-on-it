const {
  getRandomColor,
  getRandomGifByTerm,
  getRandomNum,
  makeApiCall,
  prepareEmbed,
  sendContent,
} = require('../lib/helpers');
const { kanyeHeads } = require('../lib/lists');
const { kanyeApi } = require('../lib/urls');

module.exports = {
  name: 'kanye',
  description: 'Random Kanye West quote from https://kanye.rest',
  args: false,
  async execute(msg, args) {
    // console.log(args);
    const apiUrl = kanyeApi();
    const kanyeData = await makeApiCall(apiUrl);
    // const kanyeGif = await getRandomGifByTerm('kanye');
    const randomColor = getRandomColor();
    const kanyeEmbed = prepareEmbed({
      command: this.name,
      msg,
      embedColor: randomColor,
      embedDescription: `**${kanyeData.quote}**`,
      embedThumbnail: kanyeHeads[getRandomNum(kanyeHeads.length)],
      // embedImage: kanyeHeads[getRandomNum(kanyeHeads.length)],
    });
    sendContent(msg, kanyeEmbed);
  },
};
