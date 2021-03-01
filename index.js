const discord = require('discord.js');
require('dotenv').config();

const { initCommands } = require('./lib/commands');
const { initEasterEggs } = require('./lib/easter-eggs');

const { DISCORD_BOT_TOKEN } = process.env;

const client = new discord.Client();

client.on('ready', () => {
  console.log('🐦💬 Bird Bot is ready');
});

client.login(DISCORD_BOT_TOKEN);

client.on('message', async (msg) => {
  await initEasterEggs(msg);
  await initCommands(msg);
});
