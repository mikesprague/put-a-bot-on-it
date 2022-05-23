import { SlashCommandBuilder } from '@discordjs/builders';

export default {
  data: new SlashCommandBuilder()
    .setName('react')
    .setDescription('Add animated emoji reaction to last posted message')
    .addStringOption((option) =>
      option
        .setName('emoji')
        .setDescription('Animated emoji to react with')
        .setRequired(true)
        .addChoices(
          { name: 'air_quotes', value: '756186838212935742' },
          { name: 'angry_parrot', value: '756186838426714202' },
          { name: 'cat_jam', value: '824963110850265108' },
          { name: 'cheers', value: '933710349704757268' },
          { name: 'dumpster_fire', value: '824963599759048747' },
          { name: 'mic_drop', value: '779346781385392178' },
          { name: 'parrot_shuffle', value: '755823822153842708' },
          { name: 'party_cat', value: '963159789561593866' },
          { name: 'party_parrot', value: '755823821830881342' },
          { name: 'party_wizard', value: '824974801936056320' },
          { name: 'ship_it_parrot', value: '824974802136858624' },
          { name: 'this_is_fine', value: '756184777052389458' },
          { name: 'party_poop', value: '978295282557141042' },
          { name: 'christmas_parrot', value: '978295756379263017' },
          { name: 'party_doge', value: '978295756152787034' },
          { name: 'fast_parrot', value: '978295755783696406' },
          { name: 'wine_parrot', value: '978295282779439135' },
          { name: 'party_troll', value: '978295282720735302' },
          { name: 'viking_parrot', value: '978295282515193946' },
          { name: 'sad_parrot', value: '978295282469048360' },
          { name: 'head_banging_parrot', value: '978295282242572299' },
          { name: 'flying_money_parrot', value: '978295282196426784' },
          { name: 'sleeping_parrot', value: '978295282125111337' },
          { name: 'twins_parrot', value: '978295282062221363' },
          { name: 'zombie', value: '756184776519450754' },
        ),
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
