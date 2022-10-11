import { Collection } from 'discord.js';
import fs from 'node:fs';

import { initAllGifGreetings } from '../lib/greetings.js';
import { birdLog } from '../lib/helpers.js';

export const event = {
  name: 'ready',
  once: true,
  async execute(client) {
    const slashCommandFiles = await fs
      .readdirSync('./src/commands')
      .filter((file) => file.endsWith('.js'));

    client.slashCommands = new Collection();
    client.animatedEmoji = new Collection();

    for await (const file of slashCommandFiles) {
      const slashCommand = await import(`../commands/${file}`);
      client.slashCommands.set(slashCommand.default.data.name, slashCommand);
    }

    const customEmoji = client.emojis.cache.filter(
      (emoji) => emoji.animated === true,
    );

    for (const emoji of customEmoji) {
      client.animatedEmoji.set(emoji[1].name, emoji[0]);
    }

    initAllGifGreetings(client);

    birdLog('Bird Bot is online');
  },
};
