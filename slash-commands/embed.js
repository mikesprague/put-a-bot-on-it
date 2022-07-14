import { SlashCommandBuilder } from '@discordjs/builders';
import {
  filterArrayOfObjects,
  getCustomEmojiCode,
  getRandomNum,
  getRandomColor,
  getTenorGifs,
  prepareEmbed,
  registerTenorGifShare,
  sendEmbed,
  sortArrayOfObjects,
} from '../lib/helpers.js';
import { commands } from '../lib/embed-options.js';

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
        .addChoices(...choices),
    )
    .addStringOption((option) =>
      option.setName('query').setDescription('Enter optional search query'),
    ),
  async execute(interaction) {
    const subject = interaction.options.getString('subject');
    const [subjectOptions] = filterArrayOfObjects(commands, 'value', subject);
    const emojiStrings = subjectOptions.emoji;

    const subjectEmoji = emojiStrings
      ? getCustomEmojiCode(emojiStrings[getRandomNum(emojiStrings.length)])
      : null;

    const embedColor = getRandomColor();

    const arg = interaction.options.getString('query');
    const useArg = Boolean(arg && arg.trim().length);
    const searchTerm = useArg ? `${subject} ${arg}` : subject;

    const subjectGifs = await getTenorGifs({ searchTerm });

    const randomNum = useArg
      ? getRandomNum(Math.min(subjectGifs.length, 20))
      : getRandomNum(subjectGifs.length);

    const embedImage = subjectGifs[randomNum].media_formats.gif.url;
    
    const subjectEmbed = prepareEmbed({
      embedImage,
      embedFooter: useArg ? `query: ${arg}` : '',
      embedColor,
    });

    await sendEmbed(interaction, subjectEmbed, subjectEmoji);
    await registerTenorGifShare(subjectGifs[randomNum], searchTerm);
  },
};
