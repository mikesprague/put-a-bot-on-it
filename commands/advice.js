const { makeApiCall } = require('../lib/helpers');
const { adviceApi } = require('../lib/urls');

module.exports = {
  name: 'advice',
  description: 'Get random advice from an API',
  args: false,
  async execute(msg, args) {
    // console.log(args);
    const apiUrl = adviceApi();
    const apiData = await makeApiCall(apiUrl);
    msg.channel.send(apiData.slip.advice);
  },
};
