const { SlashCommandBuilder } = require('@discordjs/builders');

const {
  getCustomEmojiCode,
  getRandomNum,
  getGifs,
  prepareEmbed,
  sendEmbed,
} = require('../lib/helpers');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('wu-tang')
    .setDescription('Random Wu-Tang Clan GIF from Giphy')
    .addStringOption((option) =>
      option.setName('query').setDescription('Enter optional search query'),
    ),
  async execute(interaction) {
    const searchQuery = interaction.options.getString('query');
    const useSearchQuery = Boolean(searchQuery && searchQuery.trim().length);
    const searchTerm = useSearchQuery ? `wu-tang ${searchQuery}` : 'wu-tang';
    const wuTangGifs = await getGifs({ searchTerm });
    // const wuTangStickers = await getGifs({ searchTerm, stickerSearch: true });
    // const allWuGifs = [...wuTangGifs, ...wuTangStickers];
    const randomNum = useSearchQuery
      ? Math.max(wuTangGifs.length, 10)
      : getRandomNum(wuTangGifs.length);
    const embedImage = wuTangGifs[Number(randomNum)].images.original.url;
    const wuTangEmbed = prepareEmbed({ embedImage });
    const wuTangEmoji = getCustomEmojiCode('wutang');
    sendEmbed(interaction, wuTangEmbed, wuTangEmoji);
  },
};
