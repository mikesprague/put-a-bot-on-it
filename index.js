const discord = require('discord.js');
require('dotenv').config();

const { getGoodMorning } = require('./lib/helpers');
const { initCommands } = require('./lib/commands');
const { initEasterEggs } = require('./lib/easter-eggs');

const { DISCORD_BOT_TOKEN } = process.env;

const client = new discord.Client();

client.on('ready', () => {
  console.log('🐦💬 Bird Bot is online');
});

client.login(DISCORD_BOT_TOKEN);

client.setInterval(async () => {
  const now = new Date();
  const hour = now.getHours();
  console.log('hour: ', hour);
  let messageSent = false;
  if (hour === 8 && !messageSent) {
    const gif = await getGoodMorning();
    console.log('🐦💬 ', gif);
    messageSent = true;
  }
  console.log('🐦💬 messageSent: ', messageSent);
  if (hour > 8 && messageSent) {
    messageSent = false;
  }
  console.log('🐦💬 client.setInterval ran');
}, 60000);

client.on('message', async (msg) => {
  await initEasterEggs(msg);
  await initCommands(msg);
});
