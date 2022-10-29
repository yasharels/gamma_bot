const fs = require('fs');
const shuffle = require('shuffle-array');
const { EmbedBuilder } = require('discord.js');
const toId = require('toid');

const { data } = JSON.parse(fs.readFileSync('data/games/trivia.json', 'utf8'));

class TriviaGame {
  constructor(channel, rounds) {
    this.channel = channel;
    this.id = this.channel.id;
    this.leaderboard = {};
    this.timer = null;
    this.item = null;
    this.name = 'trivia';
    this.embed = null;
    this.round = 0;
    this.rounds = (rounds ? rounds : 25);
    this.data = shuffle(data, {copy: true});
  }
  newQuestion() {
    this.item = this.data.shift();
    this.embed = new EmbedBuilder();
    this.embed.addFields([{name: 'Question', value: this.item.question}]);
    this.timer = setTimeout(() => {
        this.embed.addFields([{name: 'Answer', value: this.item.answer}]);
        this.channel.send({embeds: [this.embed]});
        this.newQuestion();
    }, 45 * 1000);
    return this.channel.send({embeds: [this.embed]});
  }
  guess(guess, user) {
    if (guess.toLowerCase() === this.item.answer) {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.round++;
      if (!this.leaderboard[user.id]) this.leaderboard[user.id] = {
        points: 0,
        user
      };
      this.leaderboard[user.id].points++;
      this.embed.addFields([{name: 'Answer', value: this.item.answer}]);
      this.embed.addFields([{name: 'Winner', value: user.username}]);
      this.channel.send({
        embeds: [this.embed]
      });
      if (this.round === this.rounds) return this.end();
      this.newQuestion();
    }
  }
  end(val, user) {
    if (val === 0) {
      this.channel.send('**This game of Trivia has been forcefully ended by ' + user.username + '**');
      if (this.timer) {
        clearTimeout(this.timer);
      }
      return delete this.channel.game;
    }
    let winners = [];
    let winnerids = [];
    let max = 0;
    for (let i in this.leaderboard) {
      if (this.leaderboard[i].points > max) {
        max = this.leaderboard[i].points;
        winners = [this.leaderboard[i].user.username];
        winnerids = [this.leaderboard[i].user.id];
      } else if (this.leaderboard[i].points === max) {
        winners.push(this.leaderboard[i].user.username);
        winnerids.push(this.leaderboard[i].user.id);
      }
    }
    this.channel.send('**This game of Trivia has ended!**');
    this.channel.send('The winners are: **' + (winners.length === 0 ? 'Nobody :(' : winners) + '**');
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    return delete this.channel.game;
  }
}

exports.commands = {
  trivia: (cmdArguments, channel, user) => {
    if (channel.game) return channel.send('This channel is already playing a game.');
    if (cmdArguments && !isNaN(Number(cmdArguments.trim()))) {
      cmdArguments = Number(cmdArguments.trim());
    } else {
      cmdArguments = null;
    }
    channel.game = new TriviaGame(channel, cmdArguments);
    channel.send(`@here, **A game of Trivia has begun with ${cmdArguments ? cmdArguments : 25} rounds!**`);
    return channel.game.newQuestion();
  },
  triviaguess: (cmdArguments, channel, user) => {
    if (!channel.game) return channel.send('This channel has no trivia game going on right now.');
    return channel.game.guess(cmdArguments, user);
  },
  triviaend: (_, channel, user) => {
    channel.game.end(0, user);
  }
};
