import { InteractionType } from 'discord.js';
import dotenv from 'dotenv';

import { sendContent } from '../lib/helpers.js';

dotenv.config();

const { DISCORD_GUILD_ADMIN_ID } = process.env;

export const event = {
  name: 'interactionCreate',
  async execute(interaction) {
    if (interaction.user.id === DISCORD_GUILD_ADMIN_ID) {
      // admin specific
    }
    if (interaction.type !== InteractionType.ApplicationCommand) {
      return;
    }
    const slashCommand = interaction.client.slashCommands.get(
      interaction.commandName,
    );
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
  },
};
