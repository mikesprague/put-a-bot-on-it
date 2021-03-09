const { getRandomNum, getGifs } = require('../lib/helpers');

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
    // eslint-disable-next-line security/detect-object-injection
    msg.channel.send(steveGifs[randomNum].images.original.url);
  },
};
