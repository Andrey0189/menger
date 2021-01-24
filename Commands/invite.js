module.exports = {
  name: 'invite',
  regex: /invite/,
  desc: 'Ссылка на приглашение бота',
  module: 'misc',
  run: (message) => {
    message.channel.send('https://discord.com/oauth2/authorize?client_id=776534967371038760&scope=bot&permissions=3533888');
  }
};