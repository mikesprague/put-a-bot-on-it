const {
  getRandomColor,
  makeApiCall,
  prepareEmbed,
  sendContent,
} = require('../lib/helpers');
const { evilInsultApi } = require('../lib/urls');

module.exports = {
  name: 'insult',
  description: 'Get random insult from a mean API',
  args: false,
  async execute(msg, args) {
    // console.log(args);
    const apiUrl = evilInsultApi();
    const apiData = await makeApiCall(apiUrl);
    const randomColor = getRandomColor();
    const embed = prepareEmbed({
      command: this.name,
      msg,
      embedDescription: apiData.insult,
      embedColor: randomColor,
    });
    sendContent(msg, embed);
  },
};
