import { birdLog } from '../lib/helpers.js';

export const event = {
  name: 'presenceUpdate',
  async execute(oldStatus, newStatus, client) {
    if (
      oldStatus &&
      newStatus &&
      oldStatus.status &&
      newStatus.status &&
      newStatus.status !== oldStatus.status
    ) {
      const currentUser = client.users.cache.find(
        (user) => user.id === newStatus.userId
      );

      birdLog(`[presenceUpdate] ${currentUser.username} ${newStatus.status}`);
    }
  },
};
