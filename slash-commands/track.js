const { SlashCommandBuilder } = require('@discordjs/builders');
const {
  makeApiCall,
  prepareEmbed,
  sendEmbed,
  sendContent,
} = require('../lib/helpers');
const { packagePlaceApi } = require('../lib/urls');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('track')
    .setDescription(
      'Gets latest update for valid USPS, UPS, FedEx, or DHL tracking ids',
    )
    .addStringOption((option) =>
      option
        .setName('id')
        .setDescription('Tracking ID for USPS, UPS, FedEx, or DHL')
        .setRequired(true),
    ),
  async execute(interaction) {
    const trackingId = interaction.options.getString('id').trim().toLowerCase();
    const apiUrl = packagePlaceApi(trackingId);
    const apiData = await makeApiCall(apiUrl);
    const keys = Object.keys(apiData);
    const key = keys.length > 1 ? keys[keys.length - 1] : keys[0];
    const data = apiData[key];
    if (data && data.length) {
      const latestUpdate = data[data.length - 1];
      const locationString =
        typeof latestUpdate.location === 'object'
          ? `${latestUpdate.location.city} ${latestUpdate.location.state}`
          : latestUpdate.location;
      const trackingData = `**ID:** ${trackingId}
**Status:** ${latestUpdate.status}
**Last Location:** ${locationString}
**Timestamp:** ${latestUpdate.timestamp}`;
      const trackingEmbed = prepareEmbed({
        embedDescription: trackingData,
      });
      sendEmbed(interaction, trackingEmbed);
    } else {
      sendContent(interaction, '**Status:** Unavailable, try again later');
    }
  },
};