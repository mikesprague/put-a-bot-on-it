import { Client, Intents, Collection } from 'discord.js';
import fs from 'fs';
import dotenv from 'dotenv';
import { LocalStorage } from 'node-localstorage';

dotenv.config();

const { DISCORD_BOT_TOKEN } = process.env;

import { birdLog } from './lib/helpers.js';
import { initReactions } from './lib/reactions.js';
import { initEasterEggs, initGreetingGif } from './lib/easter-eggs.js';

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  ],
  partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
});

const slashCommandFiles = fs
  .readdirSync('./slash-commands')
  .filter((file) => file.endsWith('.js'));

const localStorage = new LocalStorage('/local-storage');

client.on('ready', async () => {
  client.slashCommands = new Collection();
  client.animatedEmoji = new Collection();

  for await (const file of slashCommandFiles) {
    const slashCommand = await import(`./slash-commands/${file}`);
    client.slashCommands.set(slashCommand.default.data.name, slashCommand);
  }

  const customEmoji = client.emojis.cache.filter(
    (emoji) => emoji.animated === true,
  );
  for (const emoji of customEmoji) {
    client.animatedEmoji.set(emoji[1].name, emoji[0]);
  }
  birdLog('Bird Bot is online');
  console.log(localStorage.removeItem('testingKey'));
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
    await slashCommand.default.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: '💀 There was an error while executing this slash command!',
      ephemeral: true,
    });
  }
});

// eslint-disable-next-line no-unused-vars
client.on('messageReactionAdd', async (reaction, user) => {
  if (reaction.partial) {
    try {
      await reaction.fetch();
      // console.log(user)
    } catch (error) {
      console.error('Something went wrong when fetching the message:', error);
      return;
    }
  }
  if (reaction.emoji.name === 'putin') {
    reaction.remove();
    reaction.message.react('🇺🇦');
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
