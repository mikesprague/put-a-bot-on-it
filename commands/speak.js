const { getRandomNum } = require('../lib/helpers');
const { speakStrings } = require('../lib/lists');

module.exports = {
  name: 'speak',
  aliases: ['talk'],
  description: 'Make Bird Bot say something',
  args: false,
  async execute(msg, args) {
    // console.log(args);
    const randonNum = getRandomNum(speakStrings.length);
    const randomMsg = speakStrings[randonNum];
    msg.channel.send({ tts: true, content: randomMsg });
  },
};
