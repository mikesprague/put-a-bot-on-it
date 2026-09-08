import fs from 'node:fs';

import { Client, GatewayIntentBits, Partials } from 'discord.js';

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
    GatewayIntentBits.GuildScheduledEvents,
    GatewayIntentBits.GuildExpressions,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildMessagePolls,
    GatewayIntentBits.GuildMessageReactions,
  ],
  partials: [
    Partials.Message,
    Partials.User,
    Partials.GuildMember,
    Partials.Channel,
    Partials.Reaction,
    Partials.SoundboardSound,
    Partials.GuildScheduledEvent,
    Partials.ThreadMember,
  ],
});

(async () => {
  const eventFiles = await fs
    .readdirSync('./src/events/')
    .filter((file) => file.endsWith('.ts'));

  for (const file of eventFiles) {
    const { event } = await import(`./events/${file}`);

    if (event.once) {
      client.once(event.name, (...args: unknown[]) =>
        event.execute(...args, client)
      );
    } else {
      client.on(event.name, (...args: unknown[]) =>
        event.execute(...args, client)
      );
    }
  }
})();

client.login(DISCORD_BOT_TOKEN!);
