module.exports = {
  name: 'unmute',
  regex: /unmute/,
  desc: 'Размутить участника',
  args: ['<@участник | тэг>', '[причина]'],
  example: 'unmute @чел#1234',
  module: 'mod',
  run: async (message, args) => {
    const matchArgs = new RegExp(args[0], 'i')
    const member = message.mentions.members.first() || message.guild.members.cache.find(m => m.user.tag.match(matchArgs));

    if (!message.member.hasPermission('MANAGE_ROLES')) return Bot.err('Вам нужно право "Управление ролями" для использования этой команды');
    if (!message.guild.me.hasPermission('MANAGE_ROLES')) return Bot.err(`У меня нет права "Управление ролями"`);
    
    if (!args[0] || !member) return Bot.err('Пользователь не найден или не указан');

    const dbServer = await Bot.getServer(message.guild.id);
    const mutedRole = message.guild.roles.cache.get(dbServer.mutedRole);
    if (!mutedRole || !member.roles.cache.get(mutedRole.id)) return Bot.err(`Этот пользователь не замучен`);

    if (member.id === message.author.id) return Bot.err('Хорошая попытка');
    const reason = args[1]? args.slice(1).join(' '): 'Без причины';

    await Bot.punishMessage(message, member, 'размучены', reason);
    member.roles.remove(mutedRole);

    let res = `${Bot.emojis.yes} Пользователь ${member} был размучен\n`;
    res += `Причина: ${reason}\n\n`;

    message.channel.send(res);
  }
};