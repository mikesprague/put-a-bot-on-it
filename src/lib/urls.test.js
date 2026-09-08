import { describe, it, expect } from 'bun:test';

import {
  adviceApi,
  affirmationApi,
  boredApi,
  breakingBadQuotesApi,
  catFactsApi,
  dadJokeApi,
  evilInsultApi,
  jokeApi,
  kanyeApi,
  klipyApiSearch,
  klipyApiShare,
  nasaApi,
  nationalDayApi,
  nationalTodayApi,
  onThisDayApi,
  packagePlaceApi,
  rickAndMortyApi,
  ronSwansonApi,
  thisForThatApi,
  vaccineSpotterApi,
  wordleSolutionApi,
  xkcdApi,
} from './urls.js';

describe('urls', () => {
  it('builds the advice api url', () => {
    expect(adviceApi()).toBe('https://api.adviceslip.com/advice');
  });

  it('builds the affirmation api url', () => {
    expect(affirmationApi()).toBe('https://www.affirmations.dev/');
  });

  it('builds the bored api url', () => {
    expect(boredApi()).toBe(
      'https://www.boredapi.com/api/activity?participants=1'
    );
  });

  it('builds the breaking bad quotes api url', () => {
    expect(breakingBadQuotesApi()).toBe(
      'https://breaking-bad-quotes.herokuapp.com/v1/quotes'
    );
  });

  it('builds the cat facts api url with a default limit', () => {
    expect(catFactsApi()).toBe('https://catfact.ninja/facts?limit=50');
  });

  it('builds the cat facts api url with a custom limit', () => {
    expect(catFactsApi(10)).toBe('https://catfact.ninja/facts?limit=10');
  });

  it('builds the dad joke api url', () => {
    expect(dadJokeApi()).toBe('https://icanhazdadjoke.com/');
  });

  it('builds the evil insult api url', () => {
    expect(evilInsultApi()).toBe(
      'https://evilinsult.com/generate_insult.php?lang=en&type=json'
    );
  });

  it('builds the joke api url', () => {
    expect(jokeApi()).toBe(
      'https://v2.jokeapi.dev/joke/Any?blacklistFlags=racist,sexist,explicit'
    );
  });

  it('builds the kanye api url', () => {
    expect(kanyeApi()).toBe('https://api.kanye.rest/');
  });

  it('builds the klipy search url with defaults', () => {
    expect(klipyApiSearch({ apiKey: 'key', searchTerm: 'party' })).toBe(
      'https://api.klipy.com/api/v1/key/gifs/search?q=party&customer_id=put-a-bot-on-it-discord-server&limit=50&pos=0&locale=US&format_filter=gif&content_filter=off'
    );
  });

  it('builds the klipy share url', () => {
    expect(
      klipyApiShare({ apiKey: 'key', searchTerm: 'party', gifId: 123 })
    ).toBe(
      'https://api.klipy.com/api/v1/key/gifs/share/123?&q=party&customer_id=put-a-bot-on-it-discord-server&locale=US'
    );
  });

  it('builds the nasa api url', () => {
    expect(nasaApi('api-key')).toBe(
      'https://api.nasa.gov/planetary/apod?api_key=api-key'
    );
  });

  it('builds the national day api url', () => {
    expect(nationalDayApi()).toBe(
      'https://api.m5ls5e.com/api/national-day-calendar'
    );
  });

  it('builds the national today api url', () => {
    expect(nationalTodayApi()).toBe(
      'https://api.m5ls5e.com/api/national-today'
    );
  });

  it('builds the on this day api url', () => {
    expect(onThisDayApi({ month: 5, day: 4 })).toBe(
      'https://today.zenquotes.io/api/5/4'
    );
  });

  it('builds the package place api url', () => {
    expect(packagePlaceApi('track-123')).toBe(
      'https://package.place/api/track/track-123?stream=true'
    );
  });

  it('builds the rick and morty rest api url by default', () => {
    expect(rickAndMortyApi()).toBe('https://rickandmortyapi.com/api');
  });

  it('builds the rick and morty graphql api url when requested', () => {
    expect(rickAndMortyApi(true)).toBe('https://rickandmortyapi.com/graphql');
  });

  it('builds the ron swanson api url', () => {
    expect(ronSwansonApi()).toBe(
      'https://ron-swanson-quotes.herokuapp.com/v2/quotes'
    );
  });

  it('builds the this for that api url', () => {
    expect(thisForThatApi()).toBe('https://itsthisforthat.com/api.php?json');
  });

  it('builds the vaccine spotter api url with a default state', () => {
    expect(vaccineSpotterApi()).toBe(
      'https://www.vaccinespotter.org/api/v0/states/NY.json'
    );
  });

  it('builds the vaccine spotter api url with a custom state', () => {
    expect(vaccineSpotterApi('CA')).toBe(
      'https://www.vaccinespotter.org/api/v0/states/CA.json'
    );
  });

  it('builds the wordle solution api url', () => {
    expect(wordleSolutionApi()).toBe(
      'https://api.m5ls5e.com/api/get-wordle-solution'
    );
  });

  it('builds the xkcd api url for the latest comic', () => {
    expect(xkcdApi()).toBe('https://xkcd.com/info.0.json');
  });

  it('builds the xkcd api url for a specific comic number', () => {
    expect(xkcdApi(614)).toBe('https://xkcd.com/614/info.0.json');
  });

  it('falls back to the latest comic for a non-integer comic number', () => {
    expect(xkcdApi('six')).toBe('https://xkcd.com/info.0.json');
  });
});
