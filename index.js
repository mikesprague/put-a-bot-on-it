const discord = require('discord.js');
require('dotenv').config();

const { initCommands } = require('./lib/commands');
const { initEasterEggs } = require('./lib/easter-eggs');

const client = new discord.Client();

client.on('ready', () => {
  console.log('🐦🤖 Bird Bot is ready');
});

client.login(process.env.DISCORD_BOT_TOKEN);

client.on('message', async (msg) => {
  initEasterEggs(msg);
  initCommands(msg);
});
