import { InteractionType, MessageFlags } from 'discord.js';

const { DISCORD_GUILD_ADMIN_ID } = process.env;

export const event = {
  name: 'interactionCreate',
  async execute(interaction, client) {
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
      console.error('[interactionCreate] Error:', error);

      const errorReply = {
        content: '💀 There was an error while executing this slash command!',
        flags: MessageFlags.Ephemeral,
      };

      try {
        if (interaction.replied) {
          await interaction.followUp(errorReply);
        } else if (interaction.deferred) {
          await interaction.editReply(errorReply);
        } else {
          await interaction.reply(errorReply);
        }
      } catch (replyError) {
        console.error(
          '[interactionCreate] Failed to send error reply:',
          replyError
        );
      }
    }
  },
};
