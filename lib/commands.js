const { getSteve, getDadJoke, normalizeMsgContent } = require('./helpers');

const initSteveCommand = async (msg) => {
  if (normalizeMsgContent(msg).startsWith('?steve')) {
    if (msg.author.bot) {
      return;
    }
    const term = normalizeMsgContent(msg).replace('?steve ', '').trim();
    const steve = await getSteve(term);
    msg.channel.send(steve);
  }
};

const initDadJokeCommand = async (msg) => {
  if (normalizeMsgContent(msg) === '?dadjoke') {
    if (msg.author.bot) {
      return;
    }
    const joke = await getDadJoke();
    msg.channel.send(joke);
  }
};

exports.initCommands = async (msg) => {
  await initDadJokeCommand(msg);
  await initSteveCommand(msg);
};
