import fs from 'fs';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import dotenv from 'dotenv';

dotenv.config();

(async () => {
  const { DISCORD_BOT_TOKEN, DISCORD_CLIENT_ID, DISCORD_GUILD_ID } =
    process.env;
  const commands = [];
  const commandFiles = fs
    .readdirSync('./slash-commands')
    .filter((file) => file.endsWith('.js'));

  for await (const file of commandFiles) {
    const command = await import(`./slash-commands/${file}`);
    commands.push(command.default.data.toJSON());
  }

  const rest = new REST({ version: '9' }).setToken(DISCORD_BOT_TOKEN);

  rest
    .put(Routes.applicationGuildCommands(DISCORD_CLIENT_ID, DISCORD_GUILD_ID), {
      body: commands,
    })
    .then(() => console.log('Successfully registered application commands.'))
    .catch(console.error);
})();
