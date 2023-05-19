
## Installation/Deployment

Create an app at https://discord.com/developers/applications/ and invite it to your server

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