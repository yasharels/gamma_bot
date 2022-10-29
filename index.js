const { Client, Events, GatewayIntentBits } = require('discord.js');

const fs = require('fs');
const path = require('path');

const parseMessage = require('./parseMessage.js').parseMessage;

require('dotenv').config(); // grab bot token from .env file 

const { TOKEN } = process.env;

const commands = require('./commands.js').commands;

for (let file of fs.readdirSync(path.resolve(__dirname, 'plugins'))) {
  Object.assign(commands, require('./plugins/' + file).commands);
}

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.once(Events.ClientReady, c => {
  console.log(`Client ready! Logged in as ${c.user.tag}`);
});

client.on('messageCreate', msg => {
  parseMessage(msg, commands);
});

client.login(TOKEN);