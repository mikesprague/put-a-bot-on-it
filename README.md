# :robot: put-a-bot-on-it

[![Deploy to Fly.io](https://github.com/mikesprague/put-a-bot-on-it/actions/workflows/deploy-to-fly-io.yml/badge.svg)](https://github.com/mikesprague/put-a-bot-on-it/actions/workflows/deploy-to-fly-io.yml)

![put-a-bird-on-it.gif](./put-a-bird-on-it.gif)

Silly bot for a private discord server I run

## Requirements

- Bun >= 1.x
  - <https://bun.sh/>
  - <https://bun.sh/docs/installation>

### Local Development

1. Clone repo `git clone https://github.com/mikesprague/put-a-bot-on-it.git`
1. Enter directory `cd put-a-bot-on-it`
1. Install dependencies `bun install`
1. Set up environment variables:
   - `DISCORD_BOT_TOKEN`
   - `DISCORD_CLIENT_ID`
   - `DISCORD_GUILD_ID`
   - `DISCORD_GUILD_ADMIN_ID`
   - `GIPHY_API_KEY`
   - `KLIPY_API_KEY`
   - `NASA_API_KEY`
   - `OPEN_AI_API_KEY`
1. Run locally `bun run dev`

### Uses (incomplete list)

- [Bun](https://bun.sh/)
- [Biome](https://biomejs.dev)
- [discord.js Library](https://github.com/discordjs/discord.js)
- [OpenAI library and APIs](https://github.com/openai/openai-node)
- [Klipy API](https://klipy.com/developers)
- [YouTube API](https://developers.google.com/youtube/v3/getting-started)
- [NASA API (Astronomy Picture of the Day)](https://api.nasa.gov/)
- [Cat Facts API](https://catfact.ninja/)
- [icanhazdadjoke.com API](https://icanhazdadjoke.com)
- [package.place API](https://package.place)
- [kanye.rest API](https://kanye.rest/)
- ...
