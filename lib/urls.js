exports.adviceApi = () => 'https://api.adviceslip.com/advice';

exports.nasaApi = (NASA_API_KEY) =>
  `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`;

exports.catFactsApi = (numToReturn = 50) =>
  `https://cat-fact.herokuapp.com/facts/random?amount=${numToReturn}`;

exports.kanyeApi = () => 'https://api.kanye.rest/';

exports.xkcdApi = (randumComicNum = null) =>
  randumComicNum && Number.isInteger(randumComicNum)
    ? `https://xkcd.com/${randumComicNum}/info.0.json`
    : 'https://xkcd.com/info.0.json';

exports.giphyApi = (GIPHY_API_KEY, encodedSearchTerm, numGifs = 50) =>
  `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${encodedSearchTerm}&limit=${numGifs}&offset=0&rating=r&lang=en`;

exports.packagePlaceApi = (trackingId) =>
  `https://package.place/api/track/${trackingId}?stream=true`;

exports.dadJokeApi = () => 'https://icanhazdadjoke.com/';
