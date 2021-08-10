const { makeApiCall, prepareEmbed, sendEmbed } = require('../lib/helpers');
const { packagePlaceApi } = require('../lib/urls');

module.exports = {
  name: 'track',
  description:
    'Gets latest update for valid USPS, UPS, FedEx, or DHL tracking numbers',
  args: true,
  async execute(msg, args) {
    // console.log(args);
    const trackingId = args[0].toLowerCase();
    const apiUrl = packagePlaceApi(trackingId);
    const apiData = await makeApiCall(apiUrl);
    const keys = Object.keys(apiData);
    const key = keys.length > 1 ? keys[keys.length - 1] : keys[0];
    // eslint-disable-next-line security/detect-object-injection
    const data = apiData[key];
    if (data && data.length) {
      const latestUpdate = data[data.length - 1];
      const locationString =
        typeof latestUpdate.location === 'object'
          ? `${latestUpdate.location.city} ${latestUpdate.location.state}`
          : latestUpdate.location;
      const trackingData = `**Status:** ${latestUpdate.status}
**Last Location:** ${locationString}
**Timestamp:** ${latestUpdate.timestamp}`;
      const trackingEmbed = prepareEmbed({
        command: `${this.name} ${trackingId}`,
        msg,
        embedDescription: trackingData,
      });
      sendEmbed(msg, trackingEmbed);
    } else {
      msg.channel.send({ content: '**Status:** Unknown, try again later' });
    }
  },
};
