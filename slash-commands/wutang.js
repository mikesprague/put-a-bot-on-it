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
    .setDescription('Random Wu-Tang Clan GIF from Giphy'),
  async execute(interaction) {
    const searchTerm = 'wu-tang';
    const wuTangGifs = await getGifs({ searchTerm });
    // const wuTangStickers = await getGifs({ searchTerm, stickerSearch: true });
    // const allWuGifs = [...wuTangGifs, ...wuTangStickers];
    const randomNum = getRandomNum(wuTangGifs.length);
    const embedImage = wuTangGifs[Number(randomNum)].images.original.url;
    const wuTangEmbed = prepareEmbed({ embedImage });
    const wuTangEmoji = getCustomEmojiCode('wutang');
    sendEmbed(interaction, wuTangEmbed, wuTangEmoji);
  },
};
