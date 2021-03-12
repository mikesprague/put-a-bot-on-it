const { makeApiCall, prepareEmbed } = require('../lib/helpers');
const { dadJokeApi } = require('../lib/urls');

module.exports = {
  name: 'dadjoke',
  description: 'Get random dad joke from an API',
  args: false,
  async execute(msg, args) {
    // console.log(args);
    const apiUrl = dadJokeApi();
    const apiData = await makeApiCall(apiUrl, 'GET', {
      Accept: 'application/json',
    });
    const dadJokeEmbed = prepareEmbed(this.name, msg, apiData.joke, '');
    msg.channel
      .send(dadJokeEmbed)
      .then(() => {
        msg.delete();
      })
      .catch((error) => console.error(error));
  },
};
