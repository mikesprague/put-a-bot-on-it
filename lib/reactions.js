const {
  getRandomBirdEmoji,
  getCustomEmojiCode,
  getRandomNum,
  messageIncludesWord,
  messageIncludesWords,
  messageMatchesWord,
  getGifs,
} = require('./helpers');
const lists = require('./lists');

exports.initReactions = async (msg) => {
  if (msg.author.bot) {
    return;
  }

  if (messageMatchesWord(msg, lists.greetings)) {
    await msg.react('👋');
    return;
  }

  // check for failed Birdles
  const sixGuessesBirdle = /Birdle\s[0-9]{1,4}\s6\/6/gi;
  const failedBirdle = /Birdle\s[0-9]{1,4}\sX\/6/gi;
  if (sixGuessesBirdle.test(msg)) {
    const phewGifs = await getGifs({ searchTerm: 'phew' });
    const randomGif =
      phewGifs[getRandomNum(phewGifs.length)].images.original.url;
    msg.channel.send({ content: randomGif });
  }
  if (failedBirdle.test(msg)) {
    const failGifs = await getGifs({ searchTerm: 'fail', stickerSearch: true });
    const wompWompGifs = await getGifs({
      searchTerm: 'womp womp',
      stickerSearch: true,
    });
    const allGifs = [...failGifs, ...wompWompGifs];
    const randomGif = allGifs[getRandomNum(allGifs.length)].images.original.url;
    msg.channel.send({ content: randomGif });
  }

  // don't put a bird on Birdle scores
  if (messageIncludesWords(msg, lists.birdSynonyms)) {
    const birdleScore = /Birdle\s[0-9]{1,4}\s(X|[1-6])\/6/gi;
    if (!birdleScore.test(msg)) {
      const randomBird = getRandomBirdEmoji();
      await msg.react(randomBird);
    }
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

  if (messageIncludesWords(msg, ['towel'])) {
    const towelieEmoji = getCustomEmojiCode('towelie');
    await msg.react(towelieEmoji);
  }

  if (
    messageIncludesWords(msg, lists.poopStrings) &&
    !messageIncludesWord(msg, '<:owlpoop:817417830110593044>')
  ) {
    await msg.react('💩');
  }
};
