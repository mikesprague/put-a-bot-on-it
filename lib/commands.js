const {
  getSteve,
  getDadJoke,
  getTrackingInfo,
  normalizeMsgContent,
} = require('./helpers');

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

const initTracking = async (msg) => {
  if (!msg.content.startsWith('?') || msg.author.bot) return;
  if (msg.content.startsWith('?track')) {
    const trackingId = msg.content.replace('?track ', '').trim();
    const trackingData = await getTrackingInfo(trackingId);
    const keys = Object.keys(trackingData);
    const key = keys.length > 1 ? keys[keys.length - 1] : keys[0];
    const data = trackingData[key];
    const latestUpdate = data[data.length - 1];
    const locationString =
      typeof latestUpdate.location === 'object'
        ? `${latestUpdate.location.city}, ${latestUpdate.location.state}`
        : latestUpdate.location;
    msg.channel.send(`**Status:** ${latestUpdate.status}
**Last Location:** ${locationString}
**Timestamp:** ${latestUpdate.timestamp}`);
  }
};

exports.initCommands = async (msg) => {
  await initDadJoke(msg);
  await initSteve(msg);
  await initTracking(msg);
};
