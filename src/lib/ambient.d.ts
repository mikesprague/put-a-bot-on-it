import type { Collection, Interaction, SlashCommandBuilder } from 'discord.js';

interface SlashCommandModule {
  default: {
    data: SlashCommandBuilder;
    execute: (interaction: Interaction) => Promise<unknown>;
  };
}

declare module 'discord.js' {
  interface Client {
    slashCommands: Collection<string, SlashCommandModule>;
    animatedEmoji: Collection<string, string>;
  }
}
