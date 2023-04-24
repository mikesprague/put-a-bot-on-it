import { Configuration, OpenAIApi } from 'openai';
import dotenv from 'dotenv';

import { birdLog } from '../lib/helpers.js';
import { initEasterEggs } from '../lib/easter-eggs.js';
import { initReactions } from '../lib/reactions.js';
import { gptGetEmoji } from '../lib/openai.js';

dotenv.config();

const { DISCORD_GUILD_ADMIN_ID, OPEN_AI_API_KEY } = process.env;

export const event = {
  name: 'messageCreate',
  async execute(msg) {
    if (msg.author.id === DISCORD_GUILD_ADMIN_ID) {
      // admin specific
    }
    try {
      const messageSize = msg.content.split(' ').length;
      if (
        messageSize > 8 ||
        (messageSize === 1 &&
          msg.content.startsWith('https://') &&
          !msg.content.includes('gif'))
      ) {
        const configuration = new Configuration({
          apiKey: OPEN_AI_API_KEY,
        });
        const openai = new OpenAIApi(configuration);

        const emojiJson = await gptGetEmoji({
          textToAnalyze: msg.content,
          openAiClient: openai,
          user: msg.author.id,
        });
        birdLog(`[messageCreate] ${msg.content}`);
        emojiJson.forEach(async (item) => {
          await msg.react(item.emoji);
        });
      }
      await initEasterEggs(msg);
    } catch (error) {
      birdLog(
        '[messageCreate] Error: 💀 There was an error with an easter egg: \n',
        error,
      );
    }

    try {
      await initReactions(msg);
    } catch (error) {
      birdLog(
        '[messageCreate] Error: 💀 There was an error with a reaction: \n',
        error,
      );
    }
  },
};
