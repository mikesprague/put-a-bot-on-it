import { SlashCommandBuilder } from 'discord.js';
import {
  getCustomEmojiCode,
  getRandomColor,
  getRandomGifByTerm,
  getRandomNum,
  makeApiCall,
  prepareEmbed,
  sendEmbed,
} from '../lib/helpers.js';
import { catFactsApi } from '../lib/urls.js';

export default {
  data: new SlashCommandBuilder()
    .setName('catfact')
    .setDescription('Random fact from the Cat Facts API'),
  async execute(interaction) {
    const apiUrl = catFactsApi();
    const apiData = await makeApiCall(apiUrl, 'GET', {
      Accept: 'application/json',
      'User-Agent': 'BirdBot (Discord.js bot on private server)',
    }).then((response) => response.data);
    const catGif = await getRandomGifByTerm('cat', false);
    const randomNum = getRandomNum(apiData.length);
    const randomColor = getRandomColor();
    const catFact = apiData[randomNum];
    const catFactEmbed = prepareEmbed({
      embedDescription: catFact.fact,
      embedImage: catGif,
      embedColor: randomColor,
    });
    const emojiArray = ['cat_jam', 'party_cat'];
    const catEmoji = getCustomEmojiCode(
      emojiArray[getRandomNum(emojiArray.length)],
    );
    return sendEmbed(interaction, catFactEmbed, catEmoji);
  },
};
