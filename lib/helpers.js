const axios = require('axios').default;

exports.birdLog = (content) => console.log('🐦💬 ', content); 

exports.getRandomNum = (maxValue) => Math.floor(Math.random() * (maxValue - 1));

exports.normalizeMsgContent = (msg) => msg.content.toLowerCase();

exports.getCustomEmojiCode = (emojiName) => {
  const customEmoji = {
    steve: '804812816287793192',
    wutang: '755775997646733492',
    trumphair: '755775997256925276',
    putin: '755775997579886683',
    farthing: '755775997479092225',
    ohyeah: '776464496436051969',
    clippy: '756184777664495626',
  };
  return customEmoji[emojiName];
};

exports.getDadJoke = async () => {
  const remoteData = await axios
    .get('https://icanhazdadjoke.com/', {
      headers: {
        Accept: 'application/json',
      },
    })
    .then((response) => response.data);
  return remoteData.joke;
};

exports.getTrackingInfo = async (trackingId) => {
  const remoteData = await axios
    .get(`https://package.place/api/track/${trackingId}?stream=true`)
    .then((response) => response.data);
  return remoteData;
};

exports.getGifs = async (searchTerm) => {
  const numGifs = 50;
  const encodedSearchTerm = encodeURIComponent(searchTerm);
  const { GIPHY_API_KEY } = process.env;
  exports.birdLog(encodedSearchTerm);
  const remoteData = await axios
    .get(
      `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${encodedSearchTerm}&limit=${numGifs}&offset=0&rating=r&lang=en`,
    )
    .then((response) => response.data);
  return remoteData.data;
};

exports.getSteve = async (term = '') => {
  const searchTerm = `steve harvey ${term.trim().length ? term : ''}`;
  const steveGifs = await exports.getGifs(searchTerm);
  const randomNum = term.trim().length
    ? exports.getRandomNum(steveGifs.length > 10 ? 10 : steveGifs.length)
    : exports.getRandomNum(steveGifs.length);
  return steveGifs[randomNum].images.original.url;
};

exports.getMiddleFinger = async () => {
  const gifs = await exports.getGifs('middle finger');
  const randomNum = exports.getRandomNum(gifs.length);
  return gifs[randomNum].images.original.url;
};

exports.getGoodMorning = async () => {
  const gifs = await exports.getGifs('good morning');
  const randomNum = exports.getRandomNum(gifs.length);
  return gifs[randomNum].images.original.url;
};
