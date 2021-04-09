module.exports = {
  adviceApi: () => 'https://api.adviceslip.com/advice',

  breakingBadQuotesApi: () => 'https://breaking-bad-quotes.herokuapp.com/v1/quotes',

  catFactsApi: (numToReturn = 50) =>
    `https://cat-fact.herokuapp.com/facts/random?amount=${numToReturn}`,

  dadJokeApi: () => 'https://icanhazdadjoke.com/',

  evilInsultApi: () =>
    'https://evilinsult.com/generate_insult.php?lang=en&type=json',

  giphyApi: ({
    apiKey,
    searchTerm,
    limit = 50,
    offset = 0,
    stickerSearch = false,
  }) =>
    `https://api.giphy.com/v1/${
      stickerSearch ? 'stickers' : 'gifs'
    }/search?api_key=${apiKey}&q=${searchTerm}&limit=${limit}&offset=${offset}&rating=r&lang=en`,

  jokeApi: () => 'https://v2.jokeapi.dev/joke/Any',

  kanyeApi: () => 'https://api.kanye.rest/',

  nasaApi: (NASA_API_KEY) =>
    `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`,

  packagePlaceApi: (trackingId) =>
    `https://package.place/api/track/${trackingId}?stream=true`,

  rickAndMortyApi: (graphql = false) =>
    `https://rickandmortyapi.com/${graphql ? 'graphql' : 'api'}`,

  ronSwansonApi: () => 'https://ron-swanson-quotes.herokuapp.com/v2/quotes',

  vaccineSpotterApi: (stateCode = 'NY') =>
    `https://www.vaccinespotter.org/api/v0/states/${stateCode}.json`,

  xkcdApi: (randumComicNum = null) =>
    randumComicNum && Number.isInteger(randumComicNum)
      ? `https://xkcd.com/${randumComicNum}/info.0.json`
      : 'https://xkcd.com/info.0.json',
};
