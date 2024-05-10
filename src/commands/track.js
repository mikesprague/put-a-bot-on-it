import { SlashCommandBuilder } from 'discord.js';
import { makeApiCall, sendContent } from '../lib/helpers.js';
import { packagePlaceApi } from '../lib/urls.js';

export default {
  data: new SlashCommandBuilder()
    .setName('track')
    .setDescription(
      'Gets latest update for valid USPS, UPS, FedEx, or DHL tracking ids'
    )
    .addStringOption((option) =>
      option
        .setName('id')
        .setDescription('Tracking ID for USPS, UPS, FedEx, or DHL')
        .setRequired(true)
    ),
  async execute(interaction) {
    await interaction.deferReply();
    const trackingId = interaction.options.getString('id').trim().toLowerCase();
    const apiUrl = packagePlaceApi(trackingId);
    const apiData = await makeApiCall(apiUrl, 'GET', {
      Accept: 'application/json',
      'Accept-Encoding': 'gzip, deflate',
      'User-Agent': 'BirdBot (Discord.js bot on private server)',
    });
    const keys = Object.keys(apiData);
    const key = keys.length > 1 ? keys[keys.length - 1] : keys[0];
    const data = apiData[key];
    if (data?.length) {
      const latestUpdate = data[data.length - 1];
      const locationString =
        typeof latestUpdate.location === 'object'
          ? `${latestUpdate.location.city} ${latestUpdate.location.state}`
          : latestUpdate.location;
      const trackingData = `**ID:** ${trackingId}
**Status:** ${latestUpdate.status}
**Last Location:** ${locationString}
**Timestamp:** ${latestUpdate.timestamp}`;
      // console.log(trackingData);
      return await sendContent({
        interaction,
        content: trackingData,
        ephemeral: true,
        deferred: true,
      });
    } else {
      return await sendContent({
        interaction,
        content: `**Status:** Unknown, try here <https://parcelsapp.com/en/tracking/${trackingId}>`,
        ephemeral: true,
        deferred: true,
      });
    }
  },
};
