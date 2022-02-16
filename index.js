/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
const { Client, Intents, Collection } = require('discord.js');
const fs = require('fs');

require('dotenv').config();

const { DISCORD_BOT_TOKEN } = process.env;

// const { prefix } = require('./config.json');
const { birdLog } = require('./lib/helpers');
const { initReactions } = require('./lib/reactions');
const { initEasterEggs, initGreetingGif } = require('./lib/easter-eggs');

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});
client.slashCommands = new Collection();
client.animatedEmoji = new Collection();

const slashCommandFiles = fs
  .readdirSync('./slash-commands')
  .filter((file) => file.endsWith('.js'));

for (const file of slashCommandFiles) {
  const slashCommand = require(`./slash-commands/${file}`);
  client.slashCommands.set(slashCommand.data.name, slashCommand);
}

client.on('ready', () => {
  const customEmoji = client.emojis.cache.filter(
    (emoji) => emoji.animated === true,
  );
  for (const emoji of customEmoji) {
    client.animatedEmoji.set(emoji[1].name, emoji[0]);
  }
  birdLog('Bird Bot is online');
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) {
    return;
  }
  const slashCommand = client.slashCommands.get(interaction.commandName);
  if (!slashCommand) {
    return;
  }

  try {
    await slashCommand.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: '💀 There was an error while executing this slash command!',
      ephemeral: true,
    });
  }
});

client.on('messageCreate', async (msg) => {
  try {
    await initEasterEggs(msg);
  } catch (error) {
    console.error('💀 There was an error with an easter egg: \n', error);
  }

  try {
    await initReactions(msg);
  } catch (error) {
    console.error('💀 There was an error with a reaction: \n', error);
  }
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

client.login(DISCORD_BOT_TOKEN);
