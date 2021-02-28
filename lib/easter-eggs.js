const {
  getMiddleFinger,
  getRandomNum,
  normalizeMsgContent,
} = require('./helpers');

const initBird = (msg) => {
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
  if (normalizeMsgContent(msg).includes('bird')) {
    if (msg.author.bot) {
      return;
    }
    const randomBird = getRandomNum(birdEmojis.length);
    msg.channel.send(`${birdEmojis[randomBird]} ${msg.author} said bird`);
  }
};

const initGreeting = (msg) => {
  const greetings = ['hi', 'hello', 'sup', 'yo', 'hola', 'bon jour'];
  if (greetings.includes(normalizeMsgContent(msg))) {
    if (msg.author.bot) {
      return;
    }
    msg.channel.send('👋 squawk!');
  }
};

const initMiddleFinger = async (msg) => {
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
    if (msg.author.bot) {
      return;
    }
    const middleFInger = await getMiddleFinger();
    msg.channel.send(middleFInger);
  }
};

const initCate = (msg) => {
  const msgContent = normalizeMsgContent(msg);
  if (msgContent.includes('architect') || msgContent.includes('toilet beam')) {
    if (msg.author.bot) {
      return;
    }
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
