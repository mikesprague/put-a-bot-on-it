import {
  Client,
  GatewayIntentBits,
  InteractionType,
  Partials,
  Collection,
} from 'discord.js';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const { DISCORD_BOT_TOKEN, DISCORD_GUILD_ADMIN_ID } = process.env;

import { birdLog, getRandomNum, sendContent } from './lib/helpers.js';
import { initReactions } from './lib/reactions.js';
import { initEasterEggs, initGreetingGif } from './lib/easter-eggs.js';
import { goodbyeStrings, greetingStrings } from './lib/lists.js';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
  ],
  partials: [
    Partials.Message,
    Partials.User,
    Partials.GuildMember,
    Partials.Channel,
    Partials.Reaction,
  ],
});

const slashCommandFiles = fs
  .readdirSync('./commands')
  .filter((file) => file.endsWith('.js'));

client.once('ready', async () => {
  client.slashCommands = new Collection();
  client.animatedEmoji = new Collection();

  for await (const file of slashCommandFiles) {
    const slashCommand = await import(`./commands/${file}`);
    client.slashCommands.set(slashCommand.default.data.name, slashCommand);
  }

  const customEmoji = client.emojis.cache.filter(
    (emoji) => emoji.animated === true,
  );
  for (const emoji of customEmoji) {
    client.animatedEmoji.set(emoji[1].name, emoji[0]);
  }
  birdLog('Bird Bot is online');
});

client.on('interactionCreate', async (interaction) => {
  if (interaction.user.id === DISCORD_GUILD_ADMIN_ID) {
    // admin specific
  }
  if (interaction.type !== InteractionType.ApplicationCommand) {
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
    await sendContent({
      interaction,
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
  if (msg.author.id === DISCORD_GUILD_ADMIN_ID) {
    // admin specific
  }
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

client.on('presenceUpdate', async (oldStatus, newStatus) => {
  const everyoneChannel = '756162896634970113';
  const testChannel = '819747110701236244';
  const targetChannel =
    process.env.NODE_ENV === 'production' ? everyoneChannel : testChannel;

  if (
    oldStatus &&
    newStatus &&
    oldStatus.status &&
    newStatus.status &&
    newStatus.status !== oldStatus.status
  ) {
    const channel = client.channels.cache.get(targetChannel);

    const currentUser = client.users.cache.find(
      (user) => user.id === newStatus.userId,
    );

    let greetingToSend = null;
    if (newStatus.status === 'online' && oldStatus.status !== 'online') {
      greetingToSend = `${
        greetingStrings[getRandomNum(greetingStrings.length)]
      } ${currentUser.username}!`;
    }
    if (newStatus.status !== 'online' && oldStatus.status === 'online') {
      greetingToSend = `${
        goodbyeStrings[getRandomNum(goodbyeStrings.length)]
      } ${currentUser.username} 👋`;
    }

    if (greetingToSend) {
      channel.send(greetingToSend).then(async (msg) => {
        setTimeout(async () => {
          try {
            await msg.delete();
          } catch (error) {
            console.log('Message unavailable to remove\n', msg);
          }
        }, 150000);
      });
    }
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
