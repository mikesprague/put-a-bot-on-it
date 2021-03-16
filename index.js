/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable security/detect-non-literal-require */
const Discord = require('discord.js');
const fs = require('fs');

require('dotenv').config();

const { DISCORD_BOT_TOKEN } = process.env;

const { prefix } = require('./config.json');
const { birdLog } = require('./lib/helpers');
const { initEasterEggs, initGreetingGif } = require('./lib/easter-eggs');

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs
  .readdirSync('./commands')
  .filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

client.on('ready', () => {
  birdLog('Bird Bot is online');
});

client.setInterval(async () => {
  await initGreetingGif({
    discordClient: client,
    gifSearchTerm: 'morning greeting',
    storageKey: 'greetingSent',
    greetingHour: 8,
    greetingDay: '*',
    excludeDay: 5,
  });
  await initGreetingGif({
    discordClient: client,
    gifSearchTerm: 'tgif',
    storageKey: 'greetingSent',
    greetingHour: 8,
    greetingDay: 5,
  });
  await initGreetingGif({
    discordClient: client,
    gifSearchTerm: 'happy hour',
    storageKey: 'happyHourSent',
    greetingHour: 17,
    greetingDay: '*',
    excludeDay: 5,
  });
  await initGreetingGif({
    discordClient: client,
    gifSearchTerm: 'happy hour',
    storageKey: 'happyHourSent',
    greetingHour: 16,
    greetingDay: 5,
  });
}, 600000);

client.on('message', async (msg) => {
  try {
    await initEasterEggs(msg);
  } catch (error) {
    console.error('💀 There was an error with an easter egg\n', error);
  }
  if (!msg.content.startsWith(prefix) || msg.author.bot) return;

  const args = msg.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  if (!client.commands.has(commandName)) return;

  const command = client.commands.get(commandName);
  if (command.args && !args.length) {
    msg.channel.send(`🐦💬 You didn't provide any arguments, ${msg.author}!`);
  }

  try {
    await command.execute(msg, args);
  } catch (error) {
    console.error(error);
    msg.reply('💀 There was an error trying to execute that command!');
  }
});

client.login(DISCORD_BOT_TOKEN);
