import { Client, GatewayIntentBits, Partials } from 'discord.js';
import fs from 'node:fs';

const { DISCORD_BOT_TOKEN } = process.env;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
  partials: [
    Partials.Message,
    Partials.User,
    Partials.GuildMember,
    Partials.Channel,
    Partials.Reaction,
    Partials.GuildEmoji,
  ],
});

(async () => {
  const eventFiles = await fs
    .readdirSync('./src/events/')
    .filter((file) => file.endsWith('.js'));

  for (const file of eventFiles) {
    const { event } = await import(`./events/${file}`);

    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args, client));
    } else {
      client.on(event.name, (...args) => event.execute(...args, client));
    }
  }
})();

client.login(DISCORD_BOT_TOKEN);
