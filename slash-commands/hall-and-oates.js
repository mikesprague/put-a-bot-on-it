import { SlashCommandBuilder } from 'discord.js';
import { getRandomNum, makeApiCall, sendContent } from '../lib/helpers.js';

const { YOUTUBE_API_KEY } = process.env;

export default {
  data: new SlashCommandBuilder()
    .setName('hall-and-oates')
    .setDescription('Random music video from YouTube API'),
  async execute(interaction) {
    await interaction.deferReply();
    const apiUrl = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&part=id&maxResults=100&order=relevance&q=hall%20and%20oates&safeSearch=none&type=video&videoEmbeddable=true&publishedBefore=2013-01-01T00%3A00%3A00Z&key=${YOUTUBE_API_KEY}`;
    const apiData = await makeApiCall(apiUrl, 'GET', {
      Accept: 'application/json',
    });
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
