import { SlashCommandBuilder } from 'discord.js';
import {
  makeApiCall,
  prepareEmbed,
  // sendEmbed,
  sendContent,
} from '../lib/helpers.js';
import { packagePlaceApi } from '../lib/urls.js';

export default {
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
    await interaction.deferReply();
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
      // sendEmbed(interaction, trackingEmbed);
      await interaction.editReply({ embeds: [trackingEmbed], ephemeral: true });
    } else {
      sendContent(
        interaction,
        `**Status:** Unknown, try here <https://parcelsapp.com/en/tracking/${trackingId}>`,
      );
    }
  },
};
