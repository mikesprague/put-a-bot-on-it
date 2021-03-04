const {
  getCustomEmojiCode,
  getRandomGifByTerm,
  getRandomNum,
  normalizeMsgContent,
} = require('./helpers');

const initBird = async (msg) => {
  if (msg.author.bot) return;
  const birdSynonyms = [
    'bird',
    'birdie',
    'fowl',
    'songbird',
    'warbler',
    'chick',
    'fledgling',
    'passerine',
    'raptor',
    'avifauna',
    'nestling',
    'feathered friend',
    'bird of prey',
    'feathered creature',
    'flying animal',
    'poultry',
    'chicken',
    'rooster',
    'goose',
    'capon',
    'duck',
    'turkey',
    'pheasant',
    'domestic',
    'fowl',
    'pullet',
    'geese',
    'pigeon',
    'quail',
    'grouse',
    'partridge',
  ];
  const birdEmojis = [
    '🐦',
    '🐓',
    '🐤',
    '🐣',
    '🐥',
    '🐔',
    '🐧',
    '🦃',
    '🦅',
    '🦆',
    '🦉',
    '🕊',
    '🦢',
    '🦜',
    '🦚',
  ];
  let reactionAdded = false;
  birdSynonyms.forEach(async (birdSynonym) => {
    if (!reactionAdded && normalizeMsgContent(msg).includes(birdSynonym)) {
      const randomBird = getRandomNum(birdEmojis.length);
      await msg.react(birdEmojis[randomBird]);
      reactionAdded = true;
    }
  });
};

const initTrumpHair = async (msg) => {
  if (msg.author.bot) return;
  const trumpEmoji = getCustomEmojiCode('trumphair');
  const putinEmoji = getCustomEmojiCode('putin');
  if (
    normalizeMsgContent(msg).includes('trump') &&
    !normalizeMsgContent(msg).includes('trumpet')
  ) {
    msg.react(trumpEmoji);
  }
  if (
    normalizeMsgContent(msg).includes('russia') ||
    normalizeMsgContent(msg).includes('putin')
  ) {
    msg.react(putinEmoji);
  }
};

const initSteve = async (msg) => {
  if (msg.author.bot) return;
  const steveEmoji = getCustomEmojiCode('steve');
  if (normalizeMsgContent(msg).includes('steve')) {
    msg.react(steveEmoji);
  }
};

const initRunTheJewels = async (msg) => {
  if (msg.author.bot) return;
  const rtjStrings = ['rtj', 'run the jewels', 'kill your masters', 'don\'t get captured'];
  let reactionAdded = false;
  rtjStrings.forEach(async (rtjString) => {
    if (!reactionAdded && normalizeMsgContent(msg).includes(rtjString)) {
      await msg.react('👉🏼');
      await msg.react('🤛🏿');
      reactionAdded = true;
    }
  });
};

const initGreeting = (msg) => {
  if (msg.author.bot) return;
  const greetings = ['hi', 'hello', 'sup', 'yo', 'hola', 'bon jour'];
  if (greetings.includes(normalizeMsgContent(msg))) {
    msg.react('👋');
  }
};

const initPoop = (msg) => {
  if (msg.author.bot) return;
  const strings = ['shit', 'poop', 'dump', 'dook', 'crap', 'turd'];
  let reactionAdded = false;
  strings.forEach((st) => {
    if (!reactionAdded && normalizeMsgContent(msg).includes(st)) {
      msg.react('💩');
      reactionAdded = true;
    }
  });
};

const initMiddleFinger = async (msg) => {
  if (msg.author.bot) return;
  const insults = [
    'suck it',
    'fuck off',
    'fuck you',
    'fuck off outta here',
    'dickhead',
    'dick head',
    'dick',
    'asshole',
    'ass hole',
    'eff you',
    'f u',
    'fu',
  ];
  if (insults.includes(normalizeMsgContent(msg))) {
    const middleFInger = await getRandomGifByTerm('middle finger');
    msg.channel.send(middleFInger);
  }
};

const initCate = (msg) => {
  if (msg.author.bot) return;
  const msgContent = normalizeMsgContent(msg);
  if (msgContent.includes('architect') || msgContent.includes('toilet beam')) {
    msg.channel.send(
      'https://giphy.com/gifs/funny-work-architect-CbSGut2wzWKZy',
    );
  }
};

exports.initEasterEggs = async (msg) => {
  initCate(msg);
  initGreeting(msg);
  initPoop(msg);
  await initBird(msg);
  await initSteve(msg);
  await initTrumpHair(msg);
  await initMiddleFinger(msg);
  await initRunTheJewels(msg);
};
