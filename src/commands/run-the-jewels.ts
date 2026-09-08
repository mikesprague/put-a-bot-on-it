import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';

import { getRandomNum, makeApiCall, sendContent } from '../lib/helpers.ts';

const { YOUTUBE_API_KEY } = process.env;

export default {
  data: new SlashCommandBuilder()
    .setName('rtj')
    .setDescription('Random RTJ music video from YouTube API'),
  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();
    const apiUrl = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&part=id&maxResults=100&order=relevance&q=run%20the%20jewels&safeSearch=none&type=video&videoEmbeddable=true&key=${YOUTUBE_API_KEY}`;
    const apiData = (await makeApiCall(apiUrl, 'GET', {
      Accept: 'application/json',
    })) as { items: Array<{ id: { videoId: string } }> };
    // console.log(apiData);
    const randomNum = getRandomNum(apiData.items.length);
    const { videoId } = apiData.items[randomNum].id;
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    return await sendContent({
      interaction,
      content: videoUrl,
      deferred: true,
    });
  },
};
