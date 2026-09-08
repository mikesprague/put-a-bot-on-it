import type { Collection } from 'discord.js';

declare module 'discord.js' {
  interface Client {
    // ponytail: typed `any` — tighten to a concrete command module type if a
    // shared command interface is ever introduced.
    slashCommands: Collection<string, any>;
    animatedEmoji: Collection<string, string>;
  }
}
