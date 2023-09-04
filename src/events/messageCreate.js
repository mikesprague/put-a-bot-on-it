import OpenAI from 'openai';
import dotenv from 'dotenv';
import { oneLineTrim } from 'common-tags';
import { LocalStorage } from 'node-localstorage';

import { birdLog } from '../lib/helpers.js';
import { initEasterEggs } from '../lib/easter-eggs.js';
import { initReactions } from '../lib/reactions.js';
import { gptGetEmoji } from '../lib/openai.js';

dotenv.config();

const { NODE_ENV, DISCORD_CLIENT_ID, DISCORD_GUILD_ADMIN_ID, OPEN_AI_API_KEY } =
  process.env;

const localStorage = new LocalStorage(
  NODE_ENV === 'production' ? '/local-storage' : './local-storage',
);

export const event = {
  name: 'messageCreate',
  async execute(msg, client) {
    if (
      (msg.channel.id === '814956028965158955' ||
        msg.mentions.has(DISCORD_CLIENT_ID)) &&
      msg.author.id !== DISCORD_CLIENT_ID
    ) {
      const openaiDM = new OpenAI({
        apiKey: OPEN_AI_API_KEY,
      });
      const storageKey = `messageHistory_${msg.author.id}}`;
      // localStorage.removeItem(storageKey);
      let messageHistory = localStorage.getItem(storageKey);
      if (messageHistory) {
        messageHistory = JSON.parse(messageHistory);
      } else {
        messageHistory = [];
      }
      // console.log(messageHistory);

      const messageContent =
        msg.channel.id === '814956028965158955'
          ? msg.content.trim()
          : msg.content.replace(`<@${DISCORD_CLIENT_ID}>`, '').trim();

      birdLog(`[@${msg.author.username}] ${messageContent}`);

      const systemMessage = {
        role: 'system',
        content: oneLineTrim`
          You are a robotic bird that's an AI assistant for a Discord server.
          Your name is Bird Bot. You are very helpful but also very sarcastic.
          You should respond to messages with relevant information, but also be a bit of a jerk.
          Your responses should have some personality, be a bit snarky, occasionally rude, and feature bird related puns.
        `,
      };

      const messages = [systemMessage];

      if (messageHistory.length && messageHistory.length > 8) {
        messageHistory.shift();
      }

      messages.push(...messageHistory);

      const newMessage = {
        role: 'user',
        content: messageContent,
      };

      messageHistory.push(newMessage);
      messages.push(newMessage);

      const chatResponse = await openaiDM.chat.completions
        .create({
          model: 'gpt-4',
          messages,
          temperature: 0.1,
        })
        .then((response) => response.choices[0].message.content);

      // console.log(chatResponse);
      const newReply = {
        role: 'assistant',
        content: chatResponse,
      };
      messageHistory.push(newReply);
      localStorage.setItem(storageKey, JSON.stringify(messageHistory));

      if (msg.channel.id === '814956028965158955') {
        msg.channel.send(chatResponse);
      } else {
        msg.reply(chatResponse);
      }
      birdLog(`[@Bird Bot] ${chatResponse}`);
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
