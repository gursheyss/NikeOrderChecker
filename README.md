# NikeOrderChecker

A discord bot used to retrieve info about a Nike.com order

Most of the information here was taken from the [discord.js](https://discordjs.guide/#before-you-begin) guide
## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`BOT_TOKEN` - Token of the bot

`GUILD_ID` - Server ID that the bot is in (only used for deploying commands)

`CLIENT_ID` - Client ID of the bot (only used for deploying commands)

`INTERACTION` - How the bot will reply to the message. `dm` = in a private message and `channel` in the channel the command was used.

## Installation

### Prerequisites

Install the latest node.js from https://nodejs.org/en

Create an app at https://discord.com/developers/applications/ and invite it to your server

### Deployment
Clone the project

```bash
  git clone https://github.com/gursheyss/NikeOrderChecker
```
Rename `.env.example` to `.env` and update values

Go to the project directory

```bash
  cd NikeOrderChecker
```

Install dependencies

```bash
  npm install
```

Deploy commands
```bash
  node deploy-commands.js
```

Run bot.js

```bash
  node bot.js
```

Use the command `/check order_number email`