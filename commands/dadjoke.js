const { makeApiCall, prepareEmbed, sendContent } = require('../lib/helpers');
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
    const dadJokeEmbed = prepareEmbed({
      command: this.name,
      msg,
      embedDescription: `**${apiData.joke}**`,
    });
    sendContent(msg, dadJokeEmbed);
  },
};
