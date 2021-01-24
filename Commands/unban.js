module.exports = {
  name: 'unban',
  regex: /unban/,
  desc: 'Разбанить участника',
  args: ['<ID>', '[причина]'],
  example: 'unban @чел#1234',
  module: 'mod',
  run: async (message, args) => {
    const userID = args[0];

    if (!message.member.hasPermission('BAN_MEMBERS')) return Bot.err('Вам нужно право "Банить участников" для использования этой команды');
    if (!message.guild.me.hasPermission('BAN_MEMBERS')) return Bot.err(`У меня нет права "Банить участников"`);
    
    const reason = args[1]? args.slice(1).join(' '): 'Без причины';

    message.guild.members.unban(userID).then(() => {
      Bot.punishMessage(message, member, 'разбанены', reason);

      let res = `${Bot.emojis.yes} Пользователь ${member} был разбанен\n`;
      res += `Причина: ${reason}\n\n`;

      message.channel.send(res);
    }).catch(() => {
      return Bot.err('Пользователь с таким ID не найден')
    });
  }
};