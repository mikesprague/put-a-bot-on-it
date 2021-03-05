const {
  getRandomNum,
  getDadJoke,
  getSteve,
  getXkcd,
  getTrackingInfo,
  normalizeMsgContent,
} = require('./helpers');

const { speakStrings } = require('./word-lists');

const initSteve = async (msg) => {
  if (!msg.content.startsWith('?steve') || msg.author.bot) return;
  if (normalizeMsgContent(msg).startsWith('?steve')) {
    const term = normalizeMsgContent(msg).replace('?steve', '').trim();
    const steve = await getSteve(term);
    msg.channel.send(steve);
  }
};

const initDadJoke = async (msg) => {
  if (!msg.content.startsWith('?dadjoke') || msg.author.bot) return;
  if (normalizeMsgContent(msg) === '?dadjoke') {
    const joke = await getDadJoke();
    msg.channel.send(joke);
  }
};

const initXkcd = async (msg) => {
  if (!msg.content.startsWith('?xkcd') || msg.author.bot) return;
  if (normalizeMsgContent(msg) === '?xkcd') {
    const xkcdData = await getXkcd();
    console.log(xkcdData);
    // msg.channel.send(joke);
  }
};

const initSpeak = async (msg) => {
  if (!msg.content.startsWith('?speak') || msg.author.bot) return;
  const randomMsg = speakStrings[getRandomNum(speakStrings.length)];
  if (normalizeMsgContent(msg) === '?speak') {
    msg.channel.send({ tts: true, content: randomMsg });
  }
};

const initTracking = async (msg) => {
  if (!msg.content.startsWith('?track') || msg.author.bot) return;
  const trackingId = msg.content.replace('?track ', '').trim();
  const trackingData = await getTrackingInfo(trackingId);
  const keys = Object.keys(trackingData);
  const key = keys.length > 1 ? keys[keys.length - 1] : keys[0];
  // eslint-disable-next-line security/detect-object-injection
  const data = trackingData[key];
  const latestUpdate = data[data.length - 1];
  const locationString =
    typeof latestUpdate.location === 'object'
      ? `${latestUpdate.location.city}, ${latestUpdate.location.state}`
      : latestUpdate.location;
  msg.channel.send(`**Status:** ${latestUpdate.status}
**Last Location:** ${locationString}
**Timestamp:** ${latestUpdate.timestamp}`);
};

exports.initCommands = async (msg) => {
  await initDadJoke(msg);
  await initSteve(msg);
  await initTracking(msg);
  await initSpeak(msg);
  await initXkcd(msg);
};
