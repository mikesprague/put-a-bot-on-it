import puppeteer from 'puppeteer';
import { SlashCommandBuilder } from '@discordjs/builders';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';
import { LocalStorage } from 'node-localstorage';

import {
  birdLog,
  getRandomNum,
  // getGifs,
  getTenorGifs,
} from '../lib/helpers.js';

const defaultTimezone = 'America/New_York';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault(defaultTimezone);

const localStorage = new LocalStorage('/local-storage');

export default {
  data: new SlashCommandBuilder()
    .setName('wordle')
    .setDescription(
      `Random GIF from Tenor based on current Wordle solution - warning, could spoil current game`,
    ),
  async execute(interaction) {
    const wordleState = JSON.parse(localStorage.getItem('wordle'));
    let solution = null;

    if (wordleState && wordleState.solution) {
      if (
        dayjs().format('YYYYMMDD') ===
        dayjs(wordleState.date).format('YYYYMMDD')
      ) {
        solution = wordleState.solution;
        birdLog(
          `[wordle] using cached solution (${wordleState.solution}) from ${wordleState.date}`,
        );
      }
    }
    if (!solution) {
      const browser = await puppeteer.launch({
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
        ],
      });

      const page = await browser.newPage({
        timezoneId: defaultTimezone,
      });
      await page.goto('https://www.nytimes.com/games/wordle/index.html');

      const gameState = await page.evaluate(() =>
        // eslint-disable-next-line no-undef
        window.localStorage.getItem('nyt-wordle-state'),
      );
      solution = JSON.parse(gameState).solution;
      
      await browser.close();

      localStorage.setItem(
        'wordle',
        JSON.stringify({
          solution,
          date: dayjs().format('YYYYMMDD'),
        }),
      );
      birdLog(`[wordle] fetched new solution (${solution})`);
    }

    // const wordleGifs = await getGifs({ searchTerm });
    const wordleGifs = await getTenorGifs({ searchTerm: solution });
    const randomNum = getRandomNum(wordleGifs.length);
    // const embedImage = wordleGifs[randomNum].images.original.url;
    const embedImage = wordleGifs[randomNum].media[0].gif.url;
    await interaction.reply({ content: embedImage, ephemeral: false });
  },
};
