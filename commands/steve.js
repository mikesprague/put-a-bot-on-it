const {
  getRandomColor,
  getRandomNum,
  getGifs,
  prepareEmbed,
  sendContent,
} = require('../lib/helpers');

module.exports = {
  name: 'steve',
  description: 'Random Steve Harvey gif',
  async execute(msg, args) {
    // console.log(args);
    // const hasTerm = args.length && args[0].length;
    const searchTerm =
      args.length && args[0].length
        ? `steve harvey ${args.join(' ').toLowerCase()}`
        : 'steve harvey';
    const steveGifs = await getGifs(searchTerm);
    const randomNum = getRandomNum(steveGifs.length);
    const randomColor = getRandomColor();
    const steveEmbed = prepareEmbed({
      command: `${
        searchTerm.replace('steve harvey', '').trim().length
          ? `${this.name} ${searchTerm.replace('steve harvey', '').trim()}`
          : this.name
      }`,
      msg,
      embedImage: steveGifs[randomNum].images.original.url,
      embedColor: randomColor,
    });
    sendContent(msg, steveEmbed);
  },
};
