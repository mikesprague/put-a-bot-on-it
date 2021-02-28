const { getSteve, getDadJoke, normalizeMsgContent } = require('./helpers');

const initSteve = async (msg) => {
  if (!msg.content.startsWith('?') || msg.author.bot) return;
  if (normalizeMsgContent(msg).startsWith('?steve')) {
    const term = normalizeMsgContent(msg).replace('?steve ', '').trim();
    const steve = await getSteve(term);
    msg.channel.send(steve);
  }
};

const initDadJoke = async (msg) => {
  if (!msg.content.startsWith('?') || msg.author.bot) return;
  if (normalizeMsgContent(msg) === '?dadjoke') {
    const joke = await getDadJoke();
    msg.channel.send(joke);
  }
};

exports.initCommands = async (msg) => {
  await initDadJoke(msg);
  await initSteve(msg);
};
