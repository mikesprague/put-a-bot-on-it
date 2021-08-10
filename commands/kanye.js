const {
  getRandomColor,
  getRandomNum,
  makeApiCall,
  prepareEmbed,
  sendEmbed,
} = require('../lib/helpers');
const { kanyeHeads } = require('../lib/lists');
const { kanyeApi } = require('../lib/urls');

module.exports = {
  name: 'kanye',
  aliases: ['kanyewest', 'kayne'],
  description: 'Random Kanye West quote from https://kanye.rest',
  args: false,
  async execute(msg, args) {
    // console.log(args);
    const argAliases = ['large', 'full'];
    const isLarge =
      args.length && argAliases.includes(args[0].trim().toLowerCase());
    const apiUrl = kanyeApi();
    const kanyeData = await makeApiCall(apiUrl);
    const randomColor = getRandomColor();
    const randomKanye = kanyeHeads[getRandomNum(kanyeHeads.length)];
    const kanyeEmbed = prepareEmbed({
      command: isLarge ? `${this.name} large` : this.name,
      msg,
      embedColor: randomColor,
      embedDescription: kanyeData.quote,
      embedThumbnail: isLarge ? '' : randomKanye,
      embedImage: isLarge ? randomKanye : '',
    });
    sendEmbed(msg, kanyeEmbed);
  },
};
