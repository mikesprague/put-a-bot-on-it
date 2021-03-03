const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
const discord = require('discord.js');

require('dotenv').config();

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('America/New_York');

const { birdLog, getRandomGifByTerm } = require('./lib/helpers');
const { initCommands } = require('./lib/commands');
const { initEasterEggs } = require('./lib/easter-eggs');

const { DISCORD_BOT_TOKEN } = process.env;

const client = new discord.Client();

client.on('ready', () => {
  birdLog('Bird Bot is online');
});

client.login(DISCORD_BOT_TOKEN);

let greetingSent = false;
let happyHourSent = false;
client.setInterval(async () => {
  const greetingHour = 8;
  const happyHour = 17;
  const now = dayjs.tz();
  const currentHour = dayjs(now).tz().get('hour');
  const day = dayjs(now).tz().get('day');
  if (currentHour === greetingHour && !greetingSent) {
    const searchTerm = day === 5 ? 'tgif' : 'good morning';
    const gif = await getRandomGifByTerm(searchTerm);
    client.channels.cache.get('756162896634970113').send(gif);
    birdLog(gif);
    greetingSent = true;
  }
  if (currentHour === happyHour && !happyHourSent) {
    const gif = await getRandomGifByTerm('happy hour');
    client.channels.cache.get('756162896634970113').send(gif);
    birdLog(gif);
    happyHourSent = true;
  }
  if (currentHour > greetingHour && greetingSent) {
    greetingSent = false;
  }
  if (currentHour > happyHour && happyHourSent) {
    happyHourSent = false;
  }
}, 600000);

client.on('message', async (msg) => {
  await initEasterEggs(msg);
  await initCommands(msg);
});
