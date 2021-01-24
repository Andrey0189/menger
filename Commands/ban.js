module.exports = {
  name: 'ban',
  regex: /ban/,
  desc: 'Забанить участника',
  args: ['<@участник | тэг>', '[причина]'],
  example: 'ban @чел#1234 реклама',
  module: 'mod',
  run: async (message, args) => {
    const matchArgs = new RegExp(args[0], 'i')
    const member = message.mentions.members.first() || message.guild.members.cache.find(m => m.user.tag.match(matchArgs));

    if (!message.member.hasPermission('BAN_MEMBERS')) return Bot.err('Вам нужно право "Банить участников" для использования этой команды');
    if (!message.guild.me.hasPermission('BAN_MEMBERS')) return Bot.err(`У меня нет права "Банить участников"`);
    
    if (!args[0] || !member) return Bot.err('Пользователь не найден или не указан');
    if (!member.bannable) return Bot.err(`У меня нет прав кикнуть участника ${member}`);

    if (member.id === message.author.id) return Bot.err('Зачем ты хочешь наказать самого себя?');
    if (member.id === Bot.client.user.id) return Bot.err('Ты серьезно?');
    const reason = args[1]? args.slice(1).join(' '): 'Без причины';

    const dbMember = await Bot.getUser(member.id + message.guild.id);
    dbMember.punishments.push({
      type: 'ban',
      date: Date.now(),
      reason: reason
    });

    await Bot.users.updateOne({id: dbMember.id}, dbMember)

    const allPuns = dbMember.punishments.length;

    let res = `${Bot.emojis.yes} Пользователь ${member} был забанен\n`;
    res += `Причина: ${reason}\n\n`;
    
    res += `Всего он был наказан **\`${allPuns}\`** ${Bot.declOfNum(allPuns, ['раз', 'раза', 'раз'])}`;
    message.channel.send(res);
    await Bot.punishMessage(message, member, 'забанены', reason);
    member.ban(reason);
  }
};