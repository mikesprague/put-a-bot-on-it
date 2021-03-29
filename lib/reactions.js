const { prefix } = require('../config.json');
const {
  getRandomBirdEmoji,
  getCustomEmojiCode,
  messageIncludesWord,
  messageIncludesWords,
  messageMatchesWord,
} = require('./helpers');
const lists = require('./lists');

exports.initReactons = async (msg) => {
  if (msg.author.bot || msg.content.startsWith(prefix)) return;

  if (messageMatchesWord(msg, lists.greetings)) {
    msg.react('👋');
    return;
  }

  if (messageIncludesWords(msg, lists.birdSynonyms)) {
    const randomBird = getRandomBirdEmoji();
    await msg.react(randomBird);
  }

  if (
    messageIncludesWord(msg, 'trump') &&
    !messageIncludesWord(msg, 'trumpet')
  ) {
    const trumpEmoji = getCustomEmojiCode('trumphair');
    await msg.react(trumpEmoji);
  }

  if (messageIncludesWords(msg, ['putin', 'russia', 'ussr', 'soviet'])) {
    const putinEmoji = getCustomEmojiCode('putin');
    await msg.react(putinEmoji);
  }

  if (messageIncludesWords(msg, ['steve', 'harvey'])) {
    const steveEmoji = getCustomEmojiCode('steve');
    await msg.react(steveEmoji);
  }

  if (
    messageIncludesWords(msg, ['kanye', 'west', 'fish sticks', 'fishsticks'])
  ) {
    const kanyeEmoji = getCustomEmojiCode('kanye');
    await msg.react(kanyeEmoji);
  }

  if (messageIncludesWords(msg, ['wu-tang', 'wu tang', 'wutang'])) {
    const wutangEmoji = getCustomEmojiCode('wutang');
    await msg.react(wutangEmoji);
  }

  if (messageIncludesWords(msg, ['ron', 'swanson'])) {
    const ronEmoji = getCustomEmojiCode('ronswanson');
    await msg.react(ronEmoji);
  }

  if (messageIncludesWords(msg, lists.rtjStrings)) {
    await msg.react('👉🏼');
    await msg.react('🤛🏿');
  }

  if (
    messageIncludesWords(msg, lists.poopStrings) &&
    !messageIncludesWord(msg, '<:owlpoop:817417830110593044>')
  ) {
    await msg.react('💩');
  }
};
