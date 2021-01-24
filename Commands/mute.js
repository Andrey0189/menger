module.exports = {
  name: 'mute',
  regex: /mute/,
  desc: 'Замутить участника (Запретить писать)',
  args: ['<@участник | тэг>', '[время]', '[причина]'],
  example: 'mute @чел#1234 24h реклама',
  module: 'mod',
  run: async (message, args) => {
    const matchArgs = new RegExp(args[0], 'i')
    const member = message.mentions.members.first() || message.guild.members.cache.find(m => m.user.tag.match(matchArgs));

    if (!message.member.hasPermission('MANAGE_ROLES')) return Bot.err('Вам нужно право "Управление ролями" для использования этой команды');
    if (!message.guild.me.hasPermission('MANAGE_ROLES')) return Bot.err(`У меня нет права "Управление ролями"`);
    
    if (!args[0] || !member) return Bot.err('Пользователь не найден или не указан');

    const dbServer = await Bot.getServer(message.guild.id);
    const mutedRole = message.guild.roles.cache.get(dbServer.mutedRole);
    if (!mutedRole) return Bot.err(`На вашем сервере нет роли для мута, добавьте или назначьте ее с помощью команды ${Bot.prefixes[0]}muted-role \`<create | set> [роль]\``)

    if (member.id === message.author.id) return Bot.err('Зачем ты хочешь наказать самого себя?');
    if (member.id === Bot.client.user.id) return Bot.err('Ты серьезно?');
    const reason = args[2]? args.slice(2).join(' '): 'Без причины';

    function getMs (time) {
      let seconds = 0;
      let years = time.match(/(\d+)\s*y/);
      let months = time.match(/(\d+)\s*M/);
      let weeks = time.match(/(\d+)\s*w/);
      let days = time.match(/(\d+)\s*d/);
      let hours = time.match(/(\d+)\s*h/);
      let minutes = time.match(/(\d+)\s*m/);
      let secs = time.match(/(\d+)\s*s/);
      if (years) { seconds += parseInt(years[1]) * 31556926 };
      if (months) { seconds += parseInt(months[1]) * 2592000 };
      if (weeks) { seconds += parseInt(weeks[1]) * 604800 };
      if (days) { seconds += parseInt(days[1]) * 86400 };
      if (hours) { seconds += parseInt(hours[1]) * 3600 };
      if (minutes) { seconds += parseInt(minutes[1]) * 60 };
      if (secs) { seconds += parseInt(secs[1]) };
      return seconds * 1000;
    };

    const dur = getMs(args[1]);

    const dbMember = await Bot.getUser(member.id + message.guild.id);
    dbMember.punishments.push({
      type: 'mute',
      duration: dur,
      date: Date.now(),
      reason: reason
    });

    await Bot.users.updateOne({id: dbMember.id}, dbMember);

    const allPuns = dbMember.punishments.length;
    const mutesCount = dbMember.punishments.filter(p => p.type === 'mute').length;

    let res = `${Bot.emojis.yes} Пользователь ${member} был замучен\n`;
    res += `Причина: ${reason}\n\n`;
    res += `Это его **\`${mutesCount}\`** мут\n`;
    res += `Всего он был наказан **\`${allPuns}\`** ${Bot.declOfNum(allPuns, ['раз', 'раза', 'раз'])}`;

    message.channel.send(res);
    await member.roles.add(mutedRole);
    Bot.punishMessage(message, member, 'замучены', reason, args[1]);

    setTimeout(() => {
      if (!member.roles.cache.find(r => r.id === mutedRole.id)) return
      member.roles.remove(mutedRole);
      Bot.punishMessage(message, member, 'автоматически размучены', 'Время мута истекло');
    }, dur);
  }
};