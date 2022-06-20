import {
  getRandomBirdEmoji,
  getCustomEmojiCode,
  getRandomNum,
  messageIncludesWord,
  messageIncludesWords,
  messageMatchesWord,
  registerTenorGifShare,
  getTenorGifs,
  prepareEmbed,
} from './helpers.js';
import * as lists from './lists.js';

export const initReactions = async (msg) => {
  if (msg.author.bot) {
    return;
  }

  if (messageMatchesWord(msg, lists.greetings)) {
    await msg.react('👋');
    return;
  }

  // check for Birdles/Wordles
  const scoreRegex = /[Birdle|Wordle]\s[0-9]{1,4}\s([1-6]|X)\/6/;
  if (scoreRegex.test(msg)) {
    let score = scoreRegex.exec(msg.content);
    score = score[1];
    if (score === 'X') {
      const failGifs = await getTenorGifs({ searchTerm: 'failure' });
      const wompWompGifs = await getTenorGifs({ searchTerm: 'womp womp' });
      const allGifs = [...failGifs, ...wompWompGifs];
      const randomGif = allGifs[getRandomNum(allGifs.length)].media[0].gif.url;
      await msg.channel.send({ content: randomGif });
    } else {
      score = Number(score);
      score -= 1;
      const scoreTerms = [
        'genius',
        'magnificent',
        'impressive',
        'splendid',
        'great',
        'phew',
      ];
      const scoreTerm = scoreTerms[Number(score)];
      const scoreGifs = await getTenorGifs({
        searchTerm: scoreTerm,
      });
      const randomNum = getRandomNum(scoreGifs.length);
      const randomGif = scoreGifs[randomNum].media[0].gif.url;
      const gameEmbed = prepareEmbed({
        embedImage: randomGif,
        embedFooter: `query: ${scoreTerm}`,
      });
      await msg.channel.send({ embeds: [gameEmbed] });
      await registerTenorGifShare(scoreGifs[randomNum], scoreTerm);
    }
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
};;;;
