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

client.setInterval(async () => {
  const now = dayjs();
  console.log('now: ', now.toString());
  const hour = dayjs(now).format('H');
  console.log('hour: ', hour);
  let messageSent = false;
  if (hour === 8 && !messageSent) {
    const gif = await getGoodMorning();
    birdLog(gif);
    messageSent = true;
  }
  birdLog('messageSent: ');
  birdLog(messageSent);
  if (hour > 8 && messageSent) {
    messageSent = false;
  }
  birdLog('client.setInterval ran');
}, 60000);

client.on('message', async (msg) => {
  await initEasterEggs(msg);
  await initCommands(msg);
});
