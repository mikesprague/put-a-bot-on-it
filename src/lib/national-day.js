import * as cron from 'node-cron';
import axios from 'axios';
import cheerio from 'cheerio';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';
import { LocalStorage } from 'node-localstorage';

const defaultTimezone = 'America/New_York';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault(defaultTimezone);

import { birdLog } from './helpers.js';

export const initNationalDayData = async () => {
  const localStorage = new LocalStorage('/local-storage');
  const storageKey = dayjs().tz(defaultTimezone).format('YYYYMMDD');
  // localStorage.clear(storageKey);
  const nationalDaysList = localStorage.getItem(storageKey);

  let nationalDaysData = [];

  if (nationalDaysList !== null && typeof nationalDaysList === 'string') {
    birdLog(
      `[initNationalDayData] Using cached National Day data for ${storageKey}`,
    );
    nationalDaysData = JSON.parse(nationalDaysList);
  } else {
    birdLog(
      `[initNationalDayData] Fetching new National Day data for ${storageKey}`,
    );
    localStorage.clear(storageKey);
    const pageData = await axios('https://nationaldaycalendar.com/')
      .then(async (response) => response.data)
      .catch((error) => birdLog(`[national-day] Error: \n`, error));
    const $ = cheerio.load(pageData);
    const groupSelector = 'div.sep_month_events';
    const groupData = $(groupSelector);
    const days = $(groupData).find(
      '.eventon_list_event.evo_eventtop.scheduled.event',
    );
    for await (const day of $(days)) {
      const title = $(day).find('span.evcal_event_title').text().trim();
      const link = $(day).find('a').first().attr('href').trim();
      // console.log(title, link);
      // nationalDaysData.push({
      //   name: title,
      //   url: link,
      // });
      const descriptionData = await axios(link)
        .then(async (response) => response.data)
        .catch((error) => birdLog(`[national-day] Error: \n`, error));
      const selector = '#ff-main-container > main > article > section';
      const $desc = cheerio.load(descriptionData);
      const description = $desc(selector).find('h2 ~ p').first().text().trim();
      // console.log(description);

      if (title && link && description) {
        nationalDaysData.push({
          title,
          link,
          description,
        });
      }
    }
    // add to storage
    localStorage.setItem(storageKey, JSON.stringify(nationalDaysData));
  }
  return nationalDaysData;
};

export const initNationalDayRefresh = async () => {
  cron.schedule(
    '5 1 * * *',
    async () => {
      await initNationalDayData();
    },
    { timezone: defaultTimezone },
  );
  birdLog('[cron] job scheduled with expression: 5 1 * * *');
};
