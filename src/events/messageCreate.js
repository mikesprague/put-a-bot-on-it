import dotenv from 'dotenv';

import { initEasterEggs } from '../lib/easter-eggs.js';
import { initReactions } from '../lib/reactions.js';

dotenv.config();

const { DISCORD_GUILD_ADMIN_ID } = process.env;

export const event = {
  name: 'messageCreate',
  async execute(msg) {
    if (msg.author.id === DISCORD_GUILD_ADMIN_ID) {
      // admin specific
    }
    try {
      await initEasterEggs(msg);
    } catch (error) {
      console.error('💀 There was an error with an easter egg: \n', error);
    }

    try {
      await initReactions(msg);
    } catch (error) {
      console.error('💀 There was an error with a reaction: \n', error);
    }
  },
};
