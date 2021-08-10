/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable security/detect-non-literal-require */
const Discord = require('discord.js');
const fs = require('fs');

require('dotenv').config();

const { DISCORD_BOT_TOKEN } = process.env;

const { prefix } = require('./config.json');
const { birdLog } = require('./lib/helpers');
const { initReactons } = require('./lib/reactions');
const { initEasterEggs, initGreetingGif } = require('./lib/easter-eggs');

const client = new Discord.Client({
  intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES],
});
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

setInterval(async () => {
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
    greetingHour: 16,
    greetingMinute: 58,
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
  await initGreetingGif({
    discordClient: client,
    gifSearchTerm: '420',
    storageKey: 'fourTwentySent',
    greetingHour: 16,
    greetingMinute: 20,
  });
}, 60000);

client.on('message', async (msg) => {
  try {
    await initEasterEggs(msg);
  } catch (error) {
    console.error('💀 There was an error with an easter egg: \n', error);
  }
  
  try {
    await initReactons(msg);
  } catch (error) {
    console.error('💀 There was an error with a reaction: \n', error);
  }

  if (!msg.content.startsWith(prefix) || msg.author.bot) return;
  
  const args = msg.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command =
    client.commands.get(commandName) ||
    client.commands.find(
      (cmd) => cmd.aliases && cmd.aliases.includes(commandName),
    );
  
    if (!command) return;
  
    if (command.args && !args.length) {
    msg.reply(`⚠ You didn't provide the required arguments!`);
  }
  
  try {
    await command.execute(msg, args);
  } catch (error) {
    console.error(error);
    msg.reply('💀 There was an error trying to execute that command!');
  }
});

client.login(DISCORD_BOT_TOKEN);
