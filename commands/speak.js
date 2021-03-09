const { getRandomNum } = require('../lib/helpers');
const { speakStrings } = require('../lib/lists');

module.exports = {
  name: 'speak',
  description: 'Make Bird Bot say something',
  args: false,
  async execute(msg, args) {
    // console.log(args);
    const randonNum = getRandomNum(speakStrings.length);
    // eslint-disable-next-line security/detect-object-injection
    const randomMsg = speakStrings[randonNum];
    msg.channel.send({ tts: true, content: randomMsg });
  },
};
