export const adviceApi = () => 'https://api.adviceslip.com/advice';

export const boredApi = () =>
  'https://www.boredapi.com/api/activity?participants=1';

export const breakingBadQuotesApi = () =>
  'https://breaking-bad-quotes.herokuapp.com/v1/quotes';

export const catFactsApi = (numToReturn = 50) =>
  `https://catfact.ninja/facts?limit=${numToReturn}`;

export const dadJokeApi = () => 'https://icanhazdadjoke.com/';

export const evilInsultApi = () =>
  'https://evilinsult.com/generate_insult.php?lang=en&type=json';

export const giphyApi = ({
  apiKey,
  searchTerm,
  limit = 50,
  offset = 0,
  stickerSearch = false,
}) =>
  `https://api.giphy.com/v1/${
    stickerSearch ? 'stickers' : 'gifs'
  }/search?api_key=${apiKey}&q=${searchTerm}&limit=${limit}&offset=${offset}&rating=r&lang=en`;

export const jokeApi = () =>
  'https://v2.jokeapi.dev/joke/Any?blacklistFlags=racist,sexist,explicit';

export const kanyeApi = () => 'https://api.kanye.rest/';

export const nasaApi = (NASA_API_KEY) =>
  `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`;

export const nationalDayApi = () =>
  'https://api.m5ls5e.com/api/national-day-calendar';

export const nationalTodayApi = () =>
  'https://api.m5ls5e.com/api/national-today';

export const packagePlaceApi = (trackingId) =>
  `https://package.place/api/track/${trackingId}?stream=true`;

export const rickAndMortyApi = (graphql = false) =>
  `https://rickandmortyapi.com/${graphql ? 'graphql' : 'api'}`;

export const ronSwansonApi = () =>
  'https://ron-swanson-quotes.herokuapp.com/v2/quotes';

export const tenorApiSearch = ({
  apiKey,
  searchTerm,
  limit = 50,
  offset = 0,
}) =>
  `https://tenor.googleapis.com/v2/search?key=${apiKey}&q=${searchTerm}&limit=${limit}&pos=${offset}&contentfilter=off&locale=en_US&media_filter=minimal`;

export const tenorApiShare = ({ apiKey, searchTerm, gifId }) =>
  `https://tenor.googleapis.com/v2/registershare?key=${apiKey}&id=${gifId}&q=${searchTerm}&locale=en_US`;

export const thisForThatApi = () => 'https://itsthisforthat.com/api.php?json';

export const trumpApi = () => 'https://www.tronalddump.io/random/quote';

export const vaccineSpotterApi = (stateCode = 'NY') =>
  `https://www.vaccinespotter.org/api/v0/states/${stateCode}.json`;

export const wordleSolutionApi = () =>
  'https://api.m5ls5e.com/api/get-wordle-solution';

export const xkcdApi = (randumComicNum = null) =>
  randumComicNum && Number.isInteger(randumComicNum)
    ? `https://xkcd.com/${randumComicNum}/info.0.json`
    : 'https://xkcd.com/info.0.json';
