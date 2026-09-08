import type { Client, Presence, User } from 'discord.js';

import { birdLog } from '../lib/helpers.ts';

export const event = {
  name: 'presenceUpdate',
  async execute(
    oldStatus: Presence | null,
    newStatus: Presence | null,
    client: Client
  ): Promise<void> {
    if (
      oldStatus &&
      newStatus &&
      oldStatus.status &&
      newStatus.status &&
      newStatus.status !== oldStatus.status
    ) {
      const currentUser: User | undefined = client.users.cache.find(
        (user) => user.id === newStatus.userId
      );

      if (currentUser) {
        birdLog(`[presenceUpdate] ${currentUser.username} ${newStatus.status}`);
      }
    }
  },
};
