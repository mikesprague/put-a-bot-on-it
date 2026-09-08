import type { MessageReaction, PartialMessageReaction } from 'discord.js';

import { birdLog } from '../lib/helpers.ts';

export const event = {
  name: 'messageReactionAdd',
  async execute(
    reaction: MessageReaction | PartialMessageReaction
  ): Promise<void> {
    if (reaction.partial) {
      try {
        await reaction.fetch();
      } catch (error) {
        birdLog(
          '[messageReactionAdd] Error: Something went wrong when fetching the message:\n',
          error
        );
        return;
      }
    }
    if (reaction.emoji.name === 'putin') {
      void reaction.remove();
      void reaction.message.react('🇺🇦');
    }
  },
};
