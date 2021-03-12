const { getRandomNum, getGifs, prepareEmbed } = require('../lib/helpers');

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
    const steveEmbed = prepareEmbed(
      `${
        searchTerm.replace('steve harvey', '').trim().length
          ? `${this.name} ${searchTerm.replace('steve harvey', '').trim()}`
          : this.name
      }`,
      msg,
      '',
      // eslint-disable-next-line security/detect-object-injection
      steveGifs[randomNum].images.original.url,
    );
    msg.channel
      .send(steveEmbed)
      .then(() => {
        msg.delete();
      })
      .catch((error) => console.error(error));
  },
};
