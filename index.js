const { Client, Events, GatewayIntentBits } = require('discord.js');

const parseMessage = require('./parseMessage.js').parseMessage;

require('dotenv').config(); // grab bot token from .env file 

const { TOKEN } = process.env;

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.once(Events.ClientReady, c => {
  console.log(`Client ready! Logged in as ${c.user.tag}`);
});

client.on('messageCreate', msg => {
  parseMessage(msg);
});

client.login(TOKEN);
