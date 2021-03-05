const discord = require('discord.js');

const {
  getRandomNum,
  getDadJoke,
  getSteve,
  getXkcd,
  getTrackingInfo,
  normalizeMsgContent,
  getKanye,
} = require('./helpers');

const { speakStrings } = require('./word-lists');

const initSteve = async (msg) => {
  if (!msg.content.startsWith('?steve') || msg.author.bot) return;
  const term = normalizeMsgContent(msg).replace('?steve', '').trim();
  const steve = await getSteve(term);
  msg.channel.send(steve);
};

const initDadJoke = async (msg) => {
  if (!msg.content.startsWith('?dadjoke') || msg.author.bot) return;
  const joke = await getDadJoke();
  msg.channel.send(joke);
};

const initXkcd = async (msg) => {
  if (!msg.content.startsWith('?xkcd') || msg.author.bot) return;
  const xkcdData =
    normalizeMsgContent(msg) === '?xkcd today'
      ? await getXkcd()
      : await getXkcd(true);
  const xkcdEmbed = new discord.MessageEmbed()
    .setTitle(xkcdData.title)
    .setURL(`https://xkcd.com/${xkcdData.num}`)
    .setImage(xkcdData.img)
    .setFooter(xkcdData.alt);
  msg.channel.send(xkcdEmbed);
};

const initKanye = async (msg) => {
  if (!msg.content.startsWith('?kanye') || msg.author.bot) return;
  const kanyeData = await getKanye();
  const kanyes = [
    'https://media.giphy.com/media/129Yiur12UfxNm/giphy.gif',
    'https://media.giphy.com/media/xUA7b2BRtvZsVz3f5m/giphy.gif',
    'https://media.giphy.com/media/xUPGce4T8IsvZZITn2/giphy.gif',
  ];
  const xkcdEmbed = new discord.MessageEmbed()
    .setColor('#4169e1')
    .setThumbnail(kanyes[getRandomNum(kanyes.length)])
    .setDescription(kanyeData.quote);
  msg.channel.send(xkcdEmbed);
};

const initSpeak = async (msg) => {
  if (!msg.content.startsWith('?speak') || msg.author.bot) return;
  const randomMsg = speakStrings[getRandomNum(speakStrings.length)];
  msg.channel.send({ tts: true, content: randomMsg });
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
  await initKanye(msg);
};
