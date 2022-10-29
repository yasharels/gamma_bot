const botPrefix = require('./config.js').botPrefix;

exports.parseMessage = msg => {
  if (!msg.content.startsWith(botPrefix) || msg.author.bot) return;
  msg.reply(msg.content);
};
