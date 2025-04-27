import fs from 'node:fs';
import { REST, Routes } from 'discord.js';

import { birdLog } from './lib/helpers.js';

(async () => {
  const { DISCORD_BOT_TOKEN, DISCORD_CLIENT_ID, DISCORD_GUILD_ID } =
    process.env;
  const commands = [];
  const commandFiles = fs
    .readdirSync('./src/commands')
    .filter((file) => file.endsWith('.js'));

  for await (const file of commandFiles) {
    const command = await import(`./commands/${file}`);
    commands.push(command.default.data.toJSON());
  }

  const rest = new REST({ version: '9' }).setToken(DISCORD_BOT_TOKEN);

  rest
    .put(Routes.applicationGuildCommands(DISCORD_CLIENT_ID, DISCORD_GUILD_ID), {
      body: commands,
    })
    .then(() =>
      birdLog('[slash-deploy] Successfully registered application commands.')
    )
    .catch(console.error);
})();
