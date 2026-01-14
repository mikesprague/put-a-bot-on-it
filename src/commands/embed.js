import { SlashCommandBuilder } from 'discord.js';

import { commands } from '../lib/embed-options.js';
import {
  filterArrayOfObjects,
  getCustomEmojiCode,
  getRandomColor,
  getRandomNum,
  getKlipyGifs,
  prepareEmbed,
  registerKlipyGifShare,
  sendEmbed,
  sortArrayOfObjects,
} from '../lib/helpers.js';

const sortedCommands = sortArrayOfObjects(commands, 'name');
const choices = sortedCommands
  .map((command) => ({
    name: command.name,
    value: command.value,
  }))
  .sort();

export default {
  data: new SlashCommandBuilder()
    .setName('embed')
    .setDescription('Create embed with random GIF from subject list')
    .addStringOption((option) =>
      option
        .setName('subject')
        .setDescription('Subject')
        .setRequired(true)
        .addChoices(...choices)
    )
    .addStringOption((option) =>
      option.setName('query').setDescription('Enter optional search query')
    ),
  async execute(interaction) {
    await interaction.deferReply();
    const subject = interaction.options.getString('subject');
    const [subjectOptions] = filterArrayOfObjects(commands, 'value', subject);
    const emojiStrings = subjectOptions.emoji;

    const subjectEmoji = emojiStrings
      ? getCustomEmojiCode(emojiStrings[getRandomNum(emojiStrings.length)])
      : null;

    const embedColor = getRandomColor();

    const arg = interaction.options.getString('query');
    const useArg = Boolean(arg?.trim().length);
    const searchTerm = useArg ? `${subject} ${arg}` : subject;

    const subjectGifs = await getKlipyGifs({ searchTerm });

    // console.log(subjectGifs);

    const randomNum = useArg
      ? getRandomNum(Math.min(subjectGifs.length, 12))
      : getRandomNum(subjectGifs.length);

    const embedImage = subjectGifs[randomNum].file.hd.gif.url;

    const subjectEmbed = prepareEmbed({
      embedImage,
      embedFooter: useArg ? `query: ${arg}` : '',
      embedColor,
    });

    await sendEmbed({
      interaction,
      content: subjectEmbed,
      reaction: subjectEmoji,
    });
    await registerKlipyGifShare(subjectGifs[randomNum], searchTerm);
  },
};
