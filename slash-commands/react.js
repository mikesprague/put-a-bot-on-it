const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('react')
    .setDescription('Add animated emoji reaction to last posted message')
    .addStringOption((option) =>
      option
        .setName('emoji')
        .setDescription('Animated emoji to react with')
        .setRequired(true)
        .addChoice('air_quotes', '756186838212935742')
        .addChoice('angry_parrot', '756186838426714202')
        .addChoice('cat_jam', '824963110850265108')
        .addChoice('cheers', '933710349704757268')
        .addChoice('dumpster_fire', '824963599759048747')
        .addChoice('gorges', '756184776829829322')
        .addChoice('mic_drop', '779346781385392178')
        .addChoice('parrot_shuffle', '755823822153842708')
        .addChoice('party_cat', '963159789561593866')
        .addChoice('party_parrot', '755823821830881342')
        .addChoice('party_wizard', '824974801936056320')
        .addChoice('ship_it_parrot', '824974802136858624')
        .addChoice('this_is_fine', '756184777052389458')
        .addChoice('unicorn_animated', '801535820062392359')
        .addChoice('zombie', '756184776519450754'),
    ),
  async execute(interaction) {
    const emojiCode = interaction.options.getString('emoji');
    const messages = await interaction.channel.messages.fetch({ limit: 1 });
    const message = await messages.last();
    await interaction.channel.messages.react(message, emojiCode);
    return await interaction.reply({
      content: `Reaction successfully added`,
      ephemeral: true,
    });
  },
};
