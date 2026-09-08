import { stripIndents } from 'common-tags';
import type { Message, TextChannel } from 'discord.js';
import OpenAI from 'openai';

import { initEasterEggs } from '../lib/easter-eggs.ts';
import { birdLog } from '../lib/helpers.ts';
import { gptGetEmoji } from '../lib/openai.ts';
import { initReactions } from '../lib/reactions.ts';
import {
  readHistory,
  removeHistory,
  trimHistory,
  writeHistory,
  type ChatMessage,
} from '../lib/storage.ts';

const { DISCORD_CLIENT_ID, DISCORD_GUILD_ADMIN_ID, OPENAI_API_KEY } =
  process.env;

export const event = {
  name: 'messageCreate',
  async execute(msg: Message): Promise<void> {
    const DISCORD_CLIENT = DISCORD_CLIENT_ID!;
    const storageKey = `messageHistory_${msg.author.id}`;
    if (
      msg.content.replace(`<@${DISCORD_CLIENT}>`, '').trim().toLowerCase() ===
      'clear-history'
    ) {
      const returnMessage = `Oh, look at that! Your message history is as empty as a bird's nest in winter. Don't worry though, I'm sure you'll fill it up with your incessant chirping soon enough.`;
      removeHistory(storageKey);
      if (msg.channel.id === '814956028965158955') {
        void (msg.channel as TextChannel).send(returnMessage);
      } else {
        await msg.reply(returnMessage);
      }
      birdLog(`[messageCreate] ${msg.author.username} cleared message history`);
      return;
    }
    if (
      (msg.channel.id === '814956028965158955' ||
        msg.mentions.has(DISCORD_CLIENT)) &&
      msg.author.id !== DISCORD_CLIENT
    ) {
      const openaiDM = new OpenAI({
        apiKey: OPENAI_API_KEY!,
      });
      let messageHistory: ChatMessage[] = readHistory(storageKey);
      // console.log(messageHistory);

      const messageContent =
        msg.channel.id === '814956028965158955'
          ? msg.content.trim()
          : msg.content.replace(`<@${DISCORD_CLIENT}>`, '').trim();

      birdLog(`[@${msg.author.username}] ${messageContent}`);

      const systemMessage: ChatMessage = {
        role: 'system',
        content: stripIndents`
          You are a robotic bird that's an AI assistant for a Discord server:
          - Your name is Bird Bot, you are very helpful and also very sarcastic.
          - You should respond to messages with relevant information, but also be a bit of a jerk.
          - Your responses should have some personality, be a bit snarky, occasionally rude, include emojis, and feature bird related puns.
          - You should also keep the responses as short as possible unless the request requires a longer answer (like a code snippet or recipe or summary of an article).
        `,
      };

      const input: ChatMessage[] = [systemMessage];

      messageHistory = trimHistory(messageHistory);

      input.push(...messageHistory);

      const newMessage: ChatMessage = {
        role: 'user',
        content: messageContent,
      };

      messageHistory.push(newMessage);
      input.push(newMessage);

      const chatResponse = await openaiDM.responses
        .create({
          model: 'gpt-5.5',
          tools: [{ type: 'web_search' }],
          input,
        })
        .then((response) => response.output_text);

      // console.log(chatResponse);
      birdLog(`[@Bird Bot] ${chatResponse}`);
      const newReply: ChatMessage = {
        role: 'assistant',
        content: chatResponse,
      };
      messageHistory.push(newReply);
      writeHistory(storageKey, messageHistory);

      if (msg.channel.id === '814956028965158955') {
        void (msg.channel as TextChannel).send(chatResponse);
      } else {
        await msg.reply(chatResponse);
      }
    }
    if (DISCORD_GUILD_ADMIN_ID && msg.author.id === DISCORD_GUILD_ADMIN_ID) {
      // admin specific
    }
    if (
      msg.channel.id !== '814956028965158955' &&
      msg.author.id !== DISCORD_CLIENT
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
            apiKey: OPENAI_API_KEY!,
          });

          const emojiJson = await gptGetEmoji({
            textToAnalyze: msg.content,
            openAiClient: openai,
          });
          birdLog(`[messageCreate] ${msg.content}`);
          for (const item of emojiJson) {
            try {
              void msg.react(item.emoji);
            } catch (error) {
              console.log(error);
            }
          }
        }
      } catch (error) {
        birdLog(
          '[messageCreate] Error: 💀 There was an error with emoji analysis: \n',
          error
        );
      }

      try {
        await initEasterEggs(msg);
      } catch (error) {
        birdLog(
          '[messageCreate] Error: 💀 There was an error with an easter egg: \n',
          error
        );
      }

      try {
        await initReactions(msg);
      } catch (error) {
        birdLog(
          '[messageCreate] Error: 💀 There was an error with a reaction: \n',
          error
        );
      }
    }
  },
};
