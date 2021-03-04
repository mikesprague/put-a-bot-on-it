const discord = require('discord.js');

require('dotenv').config();

const { birdLog, initGreetingGif } = require('./lib/helpers');
const { initCommands } = require('./lib/commands');
const { initEasterEggs } = require('./lib/easter-eggs');

const { DISCORD_BOT_TOKEN } = process.env;

const client = new discord.Client();

client.on('ready', () => {
  birdLog('Bird Bot is online');
});

client.login(DISCORD_BOT_TOKEN);

client.setInterval(async () => {
  await initGreetingGif(client, 'good morning', 'greetingSent', 8, '*', 5);
  await initGreetingGif(client, 'tgif', 'greetingSent', 8, 5);
  await initGreetingGif(client, 'happy hour', 'happyHourSent', 17);
}, 600000);

client.on('message', async (msg) => {
  await initEasterEggs(msg);
  await initCommands(msg);
});
