const {
  getRandomColor,
  makeApiCall,
  prepareEmbed,
  sendEmbed,
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
    sendEmbed(msg, embed);
  },
};
