import { birdLog } from '../lib/helpers.js';

export const event = {
  name: 'messageReactionAdd',
  async execute(reaction) {
    if (reaction.partial) {
      try {
        await reaction.fetch();
      } catch (error) {
        birdLog(
          '[messageReactionAdd] Error: Something went wrong when fetching the message:\n',
          error,
        );
        return;
      }
    }
    if (reaction.emoji.name === 'putin') {
      reaction.remove();
      reaction.message.react('🇺🇦');
    }
  },
};
