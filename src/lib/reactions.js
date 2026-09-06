import {
  getCustomEmojiCode,
  getKlipyGifs,
  getRandomBirdEmoji,
  getRandomNum,
  messageIncludesWord,
  messageIncludesWords,
  messageMatchesWord,
  prepareEmbed,
  registerKlipyGifShare,
} from './helpers.js';
import * as lists from './lists.js';

export const initReactions = async (msg) => {
  const urlRegex = /https?:\/\/\S+/i;

  if (msg.author.bot || urlRegex.test(msg.content)) {
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
      const failGifs = await getKlipyGifs({ searchTerm: 'failure' });
      const wompWompGifs = await getKlipyGifs({ searchTerm: 'womp womp' });
      const allGifs = [...failGifs, ...wompWompGifs];
      const randomGif = allGifs[getRandomNum(allGifs.length)].file.hd.gif.url;
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
      const scoreGifs = await getKlipyGifs({
        searchTerm: scoreTerm,
      });
      const randomNum = getRandomNum(scoreGifs.length);
      const randomGif = scoreGifs[randomNum].file.hd.gif.url;
      const gameEmbed = prepareEmbed({
        embedImage: randomGif,
        embedFooter: `query: ${scoreTerm}`,
      });
      await msg.channel.send({ embeds: [gameEmbed] });
      await registerKlipyGifShare(scoreGifs[randomNum], scoreTerm);
    }
  }

  if (msg.content.split(' ').length < 8) {
    // don't put a bird on Birdle scores
    if (messageIncludesWords(msg, lists.birdSynonyms)) {
      const birdleScore = /Birdle\s[0-9]{1,4}\s(X|[1-6])\/6/gi;
      if (!birdleScore.test(msg)) {
        const randomBird = getRandomBirdEmoji();
        await msg.react(randomBird);
      }
    }

    if (messageIncludesWord(msg, 'taco')) {
      await msg.react('🌮');
    }

    if (messageIncludesWord(msg, 'burrito')) {
      await msg.react('🌯');
    }

    if (messageIncludesWord(msg, 'tamale')) {
      await msg.react('🫔');
    }

    if (messageIncludesWord(msg, 'mexican')) {
      await msg.react('🌮');
      await msg.react('🌯');
      await msg.react('🫔');
    }

    if (messageIncludesWord(msg, 'beers')) {
      await msg.react('🍻');
    }

    if (messageIncludesWords(msg, ['whiskey', 'bourbon', 'shots', 'jameson'])) {
      await msg.react('🥃');
    }

    if (messageIncludesWords(msg, ['margarita', 'tequila', 'drink'])) {
      await msg.react('🍹');
    }

    if (messageIncludesWord(msg, 'beer')) {
      await msg.react('🍺');
    }

    if (messageIncludesWords(msg, ['vodka', 'martini'])) {
      await msg.react('🍸');
    }

    if (messageIncludesWord(msg, 'wine')) {
      await msg.react('🍷');
    }

    if (
      messageIncludesWords(msg, lists.poopStrings) &&
      !messageIncludesWord(msg, '<:owlpoop:817417830110593044>')
    ) {
      await msg.react('💩');
    }
  }

  if (messageIncludesWord(msg, 'cheers')) {
    const emoji = getCustomEmojiCode('cheers');
    await msg.react(emoji);
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

  if (
    messageIncludesWord(msg, 'trump') &&
    !messageIncludesWord(msg, 'trumpet')
  ) {
    const trumpEmoji = getCustomEmojiCode('trumphair');
    await msg.react(trumpEmoji);
  }

  const rtjReaction = async (msg) => {
    await msg.react('👉🏼');
    await msg.react('🤛🏿');
  };

  if (messageIncludesWords(msg, lists.rtjStrings)) {
    await rtjReaction(msg);
  }

  if (messageIncludesWords(msg, ['towel'])) {
    const towelieEmoji = getCustomEmojiCode('towelie');
    await msg.react(towelieEmoji);
  }
};
