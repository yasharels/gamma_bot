const { Client, Events, GatewayIntentBits } = require('discord.js');

require('dotenv').config(); // grab bot token from .env file 

const { token } = process.env;

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, c => {
  console.log(`Client ready! Logged in as ${c.user.tag}`);
});

client.login(token);