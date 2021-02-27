const axios = require('axios').default;
const discord = require('discord.js');
require('dotenv').config();

const client = new discord.Client();

client.on('ready', () => {
  console.log('🐦Bird Bot is ready');
});

client.login(process.env.DISCORD_BOT_TOKEN);

const getRandomNum = (maxValue) => Math.floor(Math.random() * (maxValue - 1));

const getDadJoke = async () => {
  const remoteData = await axios
    .get(
      'https://react-tailwind-netlify-starter.netlify.app/.netlify/functions/example-function',
    )
    .then((response) => response.data);
  return remoteData.joke;
};

const getGifs = async (searchTerm) => {
  const numGifs = 100;
  const remoteData = await axios
    .get(
      `https://api.giphy.com/v1/gifs/search?api_key=${process.env.GIPHY_API_KEY}&q=${searchTerm}&limit=${numGifs}&offset=0&rating=r&lang=en`,
    )
    .then((response) => response.data);
  return remoteData.data;
};

const getSteve = async (term = '') => {
  const steveGifs = await getGifs(
    term.trim().length ? `steve harvey ${term.trim()}` : '',
  );
  const randomNum = getRandomNum(steveGifs.length);
  return steveGifs[randomNum].images.original.url;
};

const getMiddleFinger = async () => {
  const gifs = await getGifs('middle finger');
  const randomNum = getRandomNum(gifs.length);
  return gifs[randomNum].images.original.url;
};

client.on('message', async (msg) => {
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
  if (msg.content.toLowerCase().includes('bird')) {
    if (msg.author.bot) {
      return;
    }
    const randomBird = getRandomNum(birdEmojis.length);
    msg.reply(`${birdEmojis[randomBird]} you said bird`);
  }
  const greetings = ['hi', 'hello', 'sup', 'yo', 'hola', 'bon jour'];
  if (greetings.includes(msg.content.toLowerCase())) {
    msg.channel.send('👋 squawk!');
  }

  const insults = [
    'suck it',
    'fuck off',
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
  if (insults.includes(msg.content.toLowerCase())) {
    const middleFInger = await getMiddleFinger();
    msg.channel.send(middleFInger);
  }

  if (msg.content.toLowerCase() === '?dadjoke') {
    const joke = await getDadJoke();
    msg.channel.send(joke);
  }
  
  if (
    msg.content.toLowerCase().includes('architect') ||
    msg.content.toLowerCase().includes('toilet beam')
  ) {
    if (msg.author.bot) {
      return;
    }
    msg.channel.send(
      'https://giphy.com/gifs/funny-work-architect-CbSGut2wzWKZy',
    );
  }

  if (msg.content.toLowerCase().includes('?steve')) {
    const term = msg.content.toLowerCase().replace('?steve ', '');
    const steve = await getSteve(term);
    msg.channel.send(steve);
  }
});
