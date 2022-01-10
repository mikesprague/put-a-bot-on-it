const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('user')
    .setDescription('Display info about yourself.'),
  async execute(interaction) {
    return interaction.reply(
      `Your username: ${interaction.user.username}\nYour ID: ${interaction.user.id}`,
    );
  },
};
