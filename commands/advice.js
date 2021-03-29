const {
  getRandomColor,
  makeApiCall,
  prepareEmbed,
  sendContent,
} = require('../lib/helpers');
const { adviceApi } = require('../lib/urls');

module.exports = {
  name: 'advice',
  description: 'Get random advice from an API',
  args: false,
  async execute(msg, args) {
    // console.log(args);
    const apiUrl = adviceApi();
    const apiData = await makeApiCall(apiUrl);
    const randomColor = getRandomColor();
    const adviceContent = apiData.slip.advice;
    const adviceEmbed = prepareEmbed({
      command: this.name,
      msg,
      embedDescription: adviceContent,
      embedColor: randomColor,
    });
    sendContent(msg, adviceEmbed);
  },
};
