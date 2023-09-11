import { stripIndents } from 'common-tags';
import { LocalStorage } from 'node-localstorage';
import OpenAI from 'openai';

import { initEasterEggs } from '../lib/easter-eggs.js';
import { birdLog } from '../lib/helpers.js';
import { gptGetEmoji } from '../lib/openai.js';
import { initReactions } from '../lib/reactions.js';

const { NODE_ENV, DISCORD_CLIENT_ID, DISCORD_GUILD_ADMIN_ID, OPEN_AI_API_KEY } =
  process.env;

const localStorage = new LocalStorage(
  NODE_ENV === 'production' ? '/local-storage' : './local-storage',
);

export const event = {
  name: 'messageCreate',
  async execute(msg) {
    const storageKey = `messageHistory_${msg.author.id}}`;
    if (
      msg.content
        .replace(`<@${DISCORD_CLIENT_ID}>`, '')
        .trim()
        .toLowerCase() === 'clear-history'
    ) {
      const returnMessage = `Oh, look at that! Your message history is as empty as a bird's nest in winter. Don't worry though, I'm sure you'll fill it up with your incessant chirping soon enough.`;
      localStorage.removeItem(storageKey);
      if (msg.channel.id === '814956028965158955') {
        msg.channel.send(returnMessage);
      } else {
        msg.reply(returnMessage);
      }
      birdLog(`[messageCreate] ${msg.author.username} cleared message history`);
      return;
    }
    if (
      (msg.channel.id === '814956028965158955' ||
        msg.mentions.has(DISCORD_CLIENT_ID)) &&
      msg.author.id !== DISCORD_CLIENT_ID
    ) {
      const openaiDM = new OpenAI({
        apiKey: OPEN_AI_API_KEY,
      });
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
        content: stripIndents`
          You are a robotic bird that's an AI assistant for a Discord server:
          - Your name is Bird Bot, you are very helpful and also very sarcastic.
          - You should respond to messages with relevant information, but also be a bit of a jerk.
          - Your responses should have some personality, be a bit snarky, occasionally rude, include emojis, and feature bird related puns.
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
          presence_penalty: 2.0,
          frequency_penalty: 2.0,
        })
        .then((response) => response.choices[0].message.content);

      // console.log(chatResponse);
      birdLog(`[@Bird Bot] ${chatResponse}`);
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
    }
    if (msg.author.id === DISCORD_GUILD_ADMIN_ID) {
      // admin specific
    }
    if (
      msg.channel.id !== '814956028965158955' &&
      msg.author.id !== DISCORD_CLIENT_ID
    ) {
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
            try {
              msg.react(item.emoji);
            } catch (error) {
              console.log(error);
            }
          });
        }
      } catch (error) {
        birdLog(
          '[messageCreate] Error: 💀 There was an error with emoji analysis: \n',
          error,
        );
      }

      try {
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
    }
  },
};
