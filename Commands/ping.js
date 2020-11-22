module.exports = {
  name: 'ping',
  regex: /ping/,
  desc: 'Пинг',
  run: (message) => {
    message.channel.send(`\`${Bot.client.ws.ping}\` ms`);
  }
};