module.exports = {
  adviceApi: () => 'https://api.adviceslip.com/advice',
  catFactsApi: (numToReturn = 50) =>
    `https://cat-fact.herokuapp.com/facts/random?amount=${numToReturn}`,
  dadJokeApi: () => 'https://icanhazdadjoke.com/',
  evilInsultApi: () =>
    'https://evilinsult.com/generate_insult.php?lang=en&type=json',
  giphyApi: (GIPHY_API_KEY, encodedSearchTerm, numGifs = 50) =>
    `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${encodedSearchTerm}&limit=${numGifs}&offset=0&rating=r&lang=en`,
  kanyeApi: () => 'https://api.kanye.rest/',
  nasaApi: (NASA_API_KEY) =>
    `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`,
  packagePlaceApi: (trackingId) =>
    `https://package.place/api/track/${trackingId}?stream=true`,
  rickAndMortyApi: (graphql = false) =>
    `https://rickandmortyapi.com/${graphql ? 'graphql' : 'api'}`,
  ronSwansonApi: () => 'https://ron-swanson-quotes.herokuapp.com/v2/quotes',
  xkcdApi: (randumComicNum = null) =>
    randumComicNum && Number.isInteger(randumComicNum)
      ? `https://xkcd.com/${randumComicNum}/info.0.json`
      : 'https://xkcd.com/info.0.json',
};
