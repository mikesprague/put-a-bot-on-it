import OpenAI from 'openai';
import dotenv from 'dotenv';
import { oneLineTrim } from 'common-tags';

import { birdLog } from '../lib/helpers.js';
import { initEasterEggs } from '../lib/easter-eggs.js';
import { initReactions } from '../lib/reactions.js';
import { gptGetEmoji } from '../lib/openai.js';

dotenv.config();

const { DISCORD_CLIENT_ID, DISCORD_GUILD_ADMIN_ID, OPEN_AI_API_KEY } =
  process.env;

export const event = {
  name: 'messageCreate',
  async execute(msg) {
    if (msg.mentions.has(DISCORD_CLIENT_ID)) {
      const openaiDM = new OpenAI({
        apiKey: OPEN_AI_API_KEY,
      });
      // const authorId = msg.author.id;
      const messageContent = msg.content
        .replace(`<@${DISCORD_CLIENT_ID}>`, '')
        .trim();
      // console.log(`<@${authorId}>`);
      console.log(messageContent);

      const systemMessage = {
        role: 'system',
        content: oneLineTrim`
          You are a robotic bird that's an AI assistant for a Discord server.
          You are very helpful but also very sarcastic.
          You should respond to messages with relevant information, but also be a bit of a jerk.
          Your responses should have some personality, be a bit snarky, occasionally rude, feature bird related puns when possible, and should be short (3 sentences or less).
        `,
      };

      const messages = [systemMessage];
      // messages.push({ role: 'user', content: `` });
      // messages.push({ role: 'assistant', content: ``});

      messages.push({ role: 'user', content: messageContent });

      const chatResponse = await openaiDM.chat.completions
        .create({
          model: 'gpt-4',
          messages,
          temperature: 0.1,
        })
        .then((response) => response.choices[0].message.content);

      console.log(chatResponse);

      msg.reply(chatResponse);
    }
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
        const openai = new OpenAI({
          apiKey: OPEN_AI_API_KEY,
        });

        const emojiJson = await gptGetEmoji({
          textToAnalyze: msg.content,
          openAiClient: openai,
        });
        birdLog(`[messageCreate] ${msg.content}`);
        emojiJson.forEach((item) => {
          msg.react(item.emoji);
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
