import { getRandomNum } from '../lib/helpers.js';
import { goodbyeStrings, greetingStrings } from '../lib/lists.js';

export const event = {
  name: 'presenceUpdate',
  async execute(oldStatus, newStatus, client) {
    const everyoneChannel = '756162896634970113';
    const testChannel = '819747110701236244';
    const targetChannel =
      process.env.NODE_ENV === 'production' ? everyoneChannel : testChannel;

    if (
      oldStatus &&
      newStatus &&
      oldStatus.status &&
      newStatus.status &&
      newStatus.status !== oldStatus.status
    ) {
      const channel = client.channels.cache.get(targetChannel);

      const currentUser = client.users.cache.find(
        (user) => user.id === newStatus.userId,
      );

      let greetingToSend = null;
      if (newStatus.status === 'online' && oldStatus.status !== 'online') {
        greetingToSend = `${
          greetingStrings[getRandomNum(greetingStrings.length)]
        } ${currentUser.username}!`;
      }
      if (newStatus.status !== 'online' && oldStatus.status === 'online') {
        greetingToSend = `${
          goodbyeStrings[getRandomNum(goodbyeStrings.length)]
        } ${currentUser.username} 👋`;
      }

      if (greetingToSend) {
        channel.send(greetingToSend).then(async (msg) => {
          setTimeout(async () => {
            try {
              await msg.delete();
            } catch (error) {
              console.log('Message unavailable to remove\n', msg);
            }
          }, 180000);
        });
      }
    }
  },
};