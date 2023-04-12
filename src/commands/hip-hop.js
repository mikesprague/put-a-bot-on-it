import { SlashCommandBuilder } from 'discord.js';
import {
  birdLog,
  getRandomNum,
  makeApiCall,
  sendContent,
} from '../lib/helpers.js';

const { YOUTUBE_API_KEY } = process.env;

const artists = [
  'Random',
  'A$AP Rocky',
  'Black Thought',
  'De La Soul',
  'Del the Funky Homosapien',
  'Kendrick Lamar',
  'Jay-Z',
  'Joey Bada$$',
  'Pharcyde',
  'Souls of Mischief',
  'A Tribe Called Quest',
  'Run the Jewels',
  'Wu-Tang Clan',
];

const choices = artists.map((artist) => ({
  name: artist,
  value: encodeURIComponent(artist.toLowerCase()),
}));

export default {
  data: new SlashCommandBuilder()
    .setName('hip-hop')
    .setDescription('Random hip-hop video from curated list of artists')
    .addStringOption((option) =>
      option
        .setName('artist')
        .setDescription('Artist')
        .setRequired(true)
        .addChoices(...choices),
    ),
  async execute(interaction) {
    await interaction.deferReply();
    let searchString = interaction.options.getString('artist');
    if (searchString === 'random') {
      searchString = encodeURIComponent(
        artists[getRandomNum(artists.length)].toLowerCase(),
      );
    }
    const apiUrl = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&part=id&maxResults=25&order=relevance&q=${searchString}&regionCode=US&relevanceLanguage=en-US&safeSearch=none&type=video&videoCategoryId=10&videoEmbeddable=true&key=${YOUTUBE_API_KEY}`;
    const apiData = await makeApiCall(apiUrl, 'GET', {
      Accept: 'application/json',
    });
    // console.log(apiData);
    birdLog(`[hip-hop] ${decodeURIComponent(searchString)}`);
    const randomNum = getRandomNum(apiData.items.length);
    const { videoId } = apiData.items[randomNum].id;
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    birdLog(`[hip-hop] ${videoUrl}`);
    return await sendContent({
      interaction,
      content: videoUrl,
      deferred: true,
    });
  },
};
