import fs from 'node:fs';

import { Client, Collection } from 'discord.js';

import { birdLog } from '../lib/helpers.ts';

export const event = {
  name: 'clientReady',
  once: true,
  async execute(client: Client): Promise<void> {
    const slashCommandFiles = await fs
      .readdirSync('./src/commands')
      .filter((file) => file.endsWith('.ts'));

    client.slashCommands = new Collection();
    client.animatedEmoji = new Collection();

    for await (const file of slashCommandFiles) {
      const slashCommand = await import(`../commands/${file}`);
      client.slashCommands.set(slashCommand.default.data.name, slashCommand);
    }

    const customEmoji = client.emojis.cache.filter(
      (emoji) => emoji.animated === true
    );

    for (const [, emoji] of customEmoji) {
      if (emoji.name && emoji.id) {
        client.animatedEmoji.set(emoji.name, emoji.id);
      }
    }

    // initAllGifGreetings(client);

    birdLog('[clientReady] Bird Bot is online');
  },
};
