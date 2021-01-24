module.exports = {
  name: 'muted-role',
  regex: /muted-role/,
  desc: 'Назначить роль мута',
  args: ['<create | set>', '[роль]'],
  example: 'mute-role create',
  module: 'mod',
  run: async (message, args) => {
    //if (!message.member.hasPermission('MANAGE_ROLES')) return Bot.err('Вам нужно право "Управление ролями" для использования этой команды');

    if (args[0] === 'create') {
      if (!message.guild.me.hasPermission(['MANAGE_ROLES', 'MANAGE_CHANNELS'])) return Bot.err(`У меня нет прав "Управление ролями" и "Управление каналами"`);
      const mutedRole = await message.guild.roles.create({
        data: { name: 'Muted' }
      });

      message.guild.channels.cache.filter(c => c.type === 'text').forEach(c => {
        c.createOverwrite(mutedRole, {
          SEND_MESSAGES: false
        })
      });

      const dbServer = await Bot.getServer(message.guild.id);
      dbServer.mutedRole = mutedRole.id;
      
      await Bot.servers.updateOne({id: dbServer.id}, dbServer);

      Bot.suc(`Роль ${mutedRole} теперь будет использоваться для мута.`);

    } else if (args[0] === 'set') {
      const matchArgs = new RegExp(args[1], 'i')
      let role = message.mentions.roles.first() || message.guild.roles.cache.find(r => r.name.match(matchArgs) || r.id === args[1]);
      if (!role) return Bot.err('Такой роли на этом сервере не существует');
      if (role.id === message.guild.roles.everyone.id) return Bot.err('Ты серьезно?');

      const dbServer = await Bot.getServer(message.guild.id);
      dbServer.mutedRole = role.id;
      
      await Bot.servers.updateOne({id: dbServer.id}, dbServer);

      Bot.suc(`Роль ${role} теперь будет использоваться для мута.`)

    } else return Bot.err('Напишите \`muted-role <create>\` для создания роли или \`muted-role <set> <роль>\` для назначения роли');
  }
};