module.exports = {
  name: 'avatar',
  regex: /ava(tar)?/,
  desc: 'Показать аватар пользователя',
  args: ['[@пользователь | тэг]'],
  example: 'avatar @чел#1234',
  run: (message, args) => {
    const matchArgs = new RegExp(args[0], 'i')
    const member = message.mentions.members.first() || message.guild.members.cache.find(m => m.user.tag.match(matchArgs)) || message.member;
    message.channel.send(member.user.avatarURL({size: 1024, dynamic: true}));
  }
};