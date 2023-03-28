import { SlashCommandBuilder } from 'discord.js';
import { getRandomNum, makeApiCall, sendContent } from '../lib/helpers.js';

const { YOUTUBE_API_KEY } = process.env;

export default {
  data: new SlashCommandBuilder()
    .setName('hip-hop')
    .setDescription('Random hip-hop music video from curated list of artists'),
  async execute(interaction) {
    await interaction.deferReply();
    const searchString = `"wu-tang clan"|"joey bada$$"|"pharcyde"|"run the jewels"|"black thought"|"a tribe called quest"|"de la soul"|"souls of mischief"|"del tha funky homosapien"|"a$ap rocky"|"kendrick lamar"|"jay-z"`;
    const apiUrl = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&part=id&maxResults=100&order=relevance&q=${encodeURIComponent(
      searchString,
    )}&regionCode=US&relevanceLanguage=en-US&safeSearch=none&type=video&videoCategoryId=10&videoEmbeddable=true&key=${YOUTUBE_API_KEY}`;
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
