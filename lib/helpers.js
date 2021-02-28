const axios = require('axios').default;

exports.getRandomNum = (maxValue) => Math.floor(Math.random() * (maxValue - 1));

exports.normalizeMsgContent = (msg) => msg.content.toLowerCase();

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
  const numGifs = 100;
  const remoteData = await axios
    .get(
      `https://api.giphy.com/v1/gifs/search?api_key=${process.env.GIPHY_API_KEY}&q=${searchTerm}&limit=${numGifs}&offset=0&rating=r&lang=en`,
    )
    .then((response) => response.data);
  return remoteData.data;
};

exports.getSteve = async (term = '') => {
  const steveGifs = await exports.getGifs(
    term.trim().length ? `steve harvey ${term.trim()}` : '',
  );
  const randomNum = exports.getRandomNum(steveGifs.length);
  return steveGifs[randomNum].images.original.url;
};

exports.getMiddleFinger = async () => {
  const gifs = await exports.getGifs('middle finger');
  const randomNum = exports.getRandomNum(gifs.length);
  return gifs[randomNum].images.original.url;
};
