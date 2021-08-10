const { makeApiCall, prepareEmbed, sendEmbed } = require('../lib/helpers');
const { jokeApi } = require('../lib/urls');

module.exports = {
  name: 'joke',
  description: 'Gets a random joke from an API',
  args: false,
  async execute(msg, args) {
    // console.log(args);
    const apiUrl = jokeApi();
    const apiData = await makeApiCall(apiUrl);
    const { type, joke, setup, delivery } = apiData;
    const dadJokeEmbed = prepareEmbed({
      command: this.name,
      msg,
      embedDescription: type === 'single' ? joke : `${setup}\n\n${delivery}`,
    });
    sendEmbed(msg, dadJokeEmbed);
  },
};
