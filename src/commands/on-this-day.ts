import dayjs from 'dayjs';
import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import he from 'he';

import { getRandomNum, makeApiCall, sendContent } from '../lib/helpers.ts';
import { onThisDayApi } from '../lib/urls.ts';

export default {
  data: new SlashCommandBuilder()
    .setName('on-this-day')
    .setDescription('on this day')
    .addStringOption((option) =>
      option
        .setName('category')
        .setDescription(
          'Random notable event, birth, or death on this day in history'
        )
        .setRequired(true)
        .addChoices(
          { name: 'Notable Event', value: 'Events' },
          { name: 'Birth', value: 'Births' },
          { name: 'Death', value: 'Deaths' },
          { name: 'Random', value: 'Random' }
        )
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    const initialCategory: string =
      interaction.options.getString('category') ?? '';
    let category: 'Events' | 'Births' | 'Deaths' =
      initialCategory === 'Events' ||
      initialCategory === 'Births' ||
      initialCategory === 'Deaths'
        ? initialCategory
        : 'Events';
    if (initialCategory === 'Random') {
      category = ['Events', 'Births', 'Deaths'][getRandomNum(3)] as
        | 'Events'
        | 'Births'
        | 'Deaths';
    }
    const month = dayjs().format('M').toString();
    const day = dayjs().format('D').toString();
    const apiUrl = onThisDayApi({ month, day });
    const apiData = (await makeApiCall(apiUrl)) as {
      data: {
        Events: Array<{ text: string }>;
        Births: Array<{ text: string }>;
        Deaths: Array<{ text: string }>;
      };
    };

    const entryNum = getRandomNum(apiData.data[category].length);
    const [year, entryText] =
      apiData.data[category][entryNum].text.split(' &#8211; ');

    const categoryEmoji: Record<'Events' | 'Births' | 'Deaths', string> = {
      Events: '📆 ',
      Births: '👶🏼 ',
      Deaths: '🪦 ',
    };

    return await sendContent({
      interaction,
      content: `${
        categoryEmoji[category]
      } ${month}/${day}/${year.trim()} - ${he.decode(entryText)}`,
    });
  },
};
