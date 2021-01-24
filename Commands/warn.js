module.exports = {
  name: 'warn',
  regex: /warn/,
  desc: 'Предупредить участника',
  args: ['<@участник | тэг>', '<причина>'],
  example: 'warn @чел#1234 реклама',
  module: 'mod',
  run: async (message, args) => {
    const matchArgs = new RegExp(args[0], 'i')
    const member = message.mentions.members.first() || message.guild.members.cache.find(m => m.user.tag.match(matchArgs));

    //if (!message.member.hasPermission('KICK_MEMBERS')) return Bot.err('Вам нужно право "Кикать участников" для использования этой команды');
    if (!args[0] || !member) return Bot.err('Пользователь не найден или не указан');
    //if (member.id === message.author.id) return Bot.err('Зачем ты хочешь наказать самого себя?');
    if (member.id === Bot.client.user.id) return Bot.err('Ты серьезно?');
    if (!args[1]) return Bot.err('Вы не указали причину');
    const reason = args.slice(1).join(' ');

    const dbMember = await Bot.getUser(member.id + message.guild.id);
    dbMember.punishments.push({
      type: 'warn',
      date: Date.now(),
      reason: reason
    });

    await Bot.users.updateOne({id: dbMember.id}, dbMember);

    Bot.punishMessage(message, member, 'предупреждены', reason);

    const allPuns = dbMember.punishments.length;
    const warnsCount = dbMember.punishments.filter(p => p.type === 'warn').length;

    let res = `${Bot.emojis.yes} Пользователь ${member} был предупрежден\n`;
    res += `Причина: ${reason}\n\n`;
    res += `Это его **\`${warnsCount}\`** предупреждение\n`;
    res += `Всего он был наказан **\`${allPuns}\`** ${Bot.declOfNum(allPuns, ['раз', 'раза', 'раз'])}`;

    message.channel.send(res)
  }
};