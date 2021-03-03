const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
const discord = require('discord.js');

require('dotenv').config();

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('America/New_York');

const { birdLog, getGoodMorning } = require('./lib/helpers');
const { initCommands } = require('./lib/commands');
const { initEasterEggs } = require('./lib/easter-eggs');

const { DISCORD_BOT_TOKEN } = process.env;

const client = new discord.Client();

client.on('ready', () => {
  birdLog('Bird Bot is online');
});

client.login(DISCORD_BOT_TOKEN);

let goodMorningSent = false;
client.setInterval(async () => {
  const goodMorningHour = 8;
  const now = dayjs.tz();
  const hour = dayjs(now).get('hour');
  if (hour === goodMorningHour && !goodMorningSent) {
    const gif = await getGoodMorning();
    client.channels.cache.get('756162896634970113').send(gif);
    birdLog(gif);
    goodMorningSent = true;
  }
  if (hour > goodMorningHour && goodMorningSent) {
    goodMorningSent = false;
  }
}, 600000);

client.on('message', async (msg) => {
  await initEasterEggs(msg);
  await initCommands(msg);
});
