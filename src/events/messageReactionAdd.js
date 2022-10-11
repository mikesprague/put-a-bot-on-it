export const event = {
  name: 'messageReactionAdd',
  async execute(reaction) {
    if (reaction.partial) {
      try {
        await reaction.fetch();
      } catch (error) {
        console.error('Something went wrong when fetching the message:', error);
        return;
      }
    }
    if (reaction.emoji.name === 'putin') {
      reaction.remove();
      reaction.message.react('🇺🇦');
    }
  },
};
