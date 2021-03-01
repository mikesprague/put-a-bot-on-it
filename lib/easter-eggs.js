const {
  getMiddleFinger,
  getRandomNum,
  normalizeMsgContent,
} = require('./helpers');

const initBird = (msg) => {
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
  birdSynonyms.forEach((birdSynonym) => {
    if (!reactionAdded && normalizeMsgContent(msg).includes(birdSynonym)) {
      const randomBird = getRandomNum(birdEmojis.length);
      msg.react(birdEmojis[randomBird]);
      reactionAdded = true;
    }
  });
};

const initGreeting = (msg) => {
  if (msg.author.bot) return;
  const greetings = ['hi', 'hello', 'sup', 'yo', 'hola', 'bon jour'];
  if (greetings.includes(normalizeMsgContent(msg))) {
    msg.channel.send('👋 squawk!');
  }
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
    const middleFInger = await getMiddleFinger();
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
  initBird(msg);
  initGreeting(msg);
  await initMiddleFinger(msg);
  initCate(msg);
};
