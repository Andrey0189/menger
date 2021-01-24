module.exports = {
  name: 'ping',
  regex: /ping/,
  desc: 'Пинг',
  module: 'misc',
  run: (message) => {
    message.channel.send(`\`${Bot.client.ws.ping}\` ms`);
  }
};