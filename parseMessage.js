const botPrefix = require('./config.js').botPrefix;

exports.parseMessage = (msg, commands) => {
  if (!msg.content.startsWith(botPrefix) || msg.author.bot) return;
  let index = msg.content.indexOf(' ');
  let cmd = msg.content.substring(botPrefix.length, index > -1 ? index : msg.content.length);
  let cmdArguments = index > -1 ? msg.content.substring(index + 1) : '';
  if (commands[cmd]) commands[cmd](cmdArguments, msg.channel, msg.author);
};
