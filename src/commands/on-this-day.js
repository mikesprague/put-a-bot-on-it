import { SlashCommandBuilder } from 'discord.js';
import dayjs from 'dayjs';
import he from 'he';

import { makeApiCall, sendContent, getRandomNum } from '../lib/helpers.js';
import { onThisDayApi } from '../lib/urls.js';

export default {
  data: new SlashCommandBuilder()
    .setName('on-this-day')
    .setDescription('on this day')
    .addStringOption((option) =>
      option
        .setName('category')
        .setDescription(
          'Random notable event, birth, or death on this day in history',
        )
        .setRequired(true)
        .addChoices(
          { name: 'Notable Event', value: 'Events' },
          { name: 'Birth', value: 'Births' },
          { name: 'Death', value: 'Deaths' },
          { name: 'Random', value: 'Random' },
        ),
    ),
  async execute(interaction) {
    let category = interaction.options.getString('category');
    const month = dayjs().format('M').toString();
    const day = dayjs().format('D').toString();
    const apiUrl = onThisDayApi({ month, day });
    const apiData = await makeApiCall(apiUrl);

    if (category === 'Random') {
      category = ['Events', 'Births', 'Deaths'][getRandomNum(3)];
    }

    const entryNum = getRandomNum(apiData.data[category].length);
    const [year, entryText] =
      apiData.data[category][entryNum].text.split(' &#8211; ');

    const categoryEmoji = {
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
