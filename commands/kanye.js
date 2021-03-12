const {
  getRandomColor,
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
    const isLarge =
      args.length && args[0].length && args[0].toLowerCase() === 'large';
    const apiUrl = kanyeApi();
    const kanyeData = await makeApiCall(apiUrl);
    const randomColor = getRandomColor();
    const randomKanye = kanyeHeads[getRandomNum(kanyeHeads.length)];
    const kanyeEmbed = prepareEmbed({
      command: isLarge ? `${this.name} large` : this.name,
      msg,
      embedColor: randomColor,
      embedDescription: `**${kanyeData.quote}**`,
      embedThumbnail: isLarge ? '' : randomKanye,
      embedImage: isLarge ? randomKanye : '',
    });
    sendContent(msg, kanyeEmbed);
  },
};
