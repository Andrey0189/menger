module.exports = {
  name: 'avatar',
  regex: /ava(tar)?/,
  desc: 'Показать аватар пользователя',
  args: ['[@пользователь | тэг | ID]'],
  example: 'avatar @чел#1234',
  module: 'util',
  run: (message, args) => {
    const matchArgs = new RegExp(args[0], 'i')
    let member = message.mentions.members.first() || message.guild.members.cache.find(m => m.user.tag.match(matchArgs) || m.id === args[0]);
    if (args[0] && !member) return Bot.err('Участник не найден');
    if (!args[0]) member = message.member;
    message.channel.send(member.user.avatarURL({size: 1024, dynamic: true}));
  }
};