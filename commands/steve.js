const {
  getRandomColor,
  getRandomNum,
  getGifs,
  prepareEmbed,
  sendEmbed,
} = require('../lib/helpers');

module.exports = {
  name: 'steve',
  aliases: ['steveharvey'],
  args: false,
  description: 'Random Steve Harvey gif',
  async execute(msg, args) {
    const arg =
      args.length && args[0].length ? args.join(' ').toLowerCase() : '';
    const searchTerm = arg.length ? `steve harvey ${arg}` : 'steve harvey';
    const steveGifs = await getGifs({ searchTerm });
    const randomNum = getRandomNum(steveGifs.length);
    const randomColor = getRandomColor();
    const steveEmbed = prepareEmbed({
      command: arg.length ? `${this.name} ${arg}` : this.name,
      msg,
      embedImage: steveGifs[Number(randomNum)].images.original.url,
      embedColor: randomColor,
    });
    sendEmbed(msg, steveEmbed);
  },
};
