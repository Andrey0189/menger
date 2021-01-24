module.exports = {
  name: 'role',
  regex: /role/,
  desc: 'Информация о роли',
  args: ['<@роль | название роли>'],
  example: 'role @Moderator',
  module: 'util',
  run: async (message, args) => {
    const matchArgs = new RegExp(args[0], 'i')
    const role = message.mentions.roles.first() || message.guild.roles.cache.find(r => r.name.match(matchArgs) || r.id === args[0]);
    if (!role) return Bot.err('Такой роли на этом сервере не существует');

    const yesNo = (boolean) => boolean? Bot.emojis.yes : Bot.emojis.no;

    const generalPerms = ['ADMINISTRATOR', 'VIEW_AUDIT_LOG', 'MANAGE_GUILD', 'MANAGE_ROLES', 'MANAGE_CHANNELS',
    'KICK_MEMBERS', 'BAN_MEMBERS', 'CREATE_INSTANT_INVITE', 'CHANGE_NICKNAME', 'MANAGE_NICKNAMES', 
    'MANAGE_EMOJIS', 'MANAGE_WEBHOOKS'];
    const textPerms = ['SEND_MESSAGES', 'SEND_TTS_MESSAGES', 'MANAGE_MESSAGES',
    'EMBED_LINKS', 'ATTACH_FILES', 'READ_MESSAGE_HISTORY', 'MENTION_EVERYONE', 'USE_EXTERNAL_EMOJIS',
    'ADD_REACTIONS'];
    const voicePerms = ['CONNECT', 'SPEAK', 'STREAM', 'MUTE_MEMBERS', 'DEAFEN_MEMBERS', 'MOVE_MEMBERS',
    'USE_VAD', 'PRIORITY_SPEAKER']

    const translatedGeneralPerms = ['Администратор', 'Смотреть журнал аудита', 'Управление сервером', 'Управление ролями', 'Управление каналами',
    'Кикать участников', 'Банить участников', 'Создавать приглашение', 'Менять ник', 'Управление никами', 
    'Управление эмодзи', 'Управление вебхуками'];
    const translatedTextPerms = ['Отправлять сообщения', 'Отправлять TTS сообщения', 'Управление сообщениями',
    'Прикреплять ссылки', 'Отправлять файлы', 'Читать историю сообщений', 'Упоминуть всех', 'Использовать сторонни эмодзи',
    'Добавлять реакции'];
    const translatedVoicePerms = ['Подключаться', 'Говорить', 'Стримить', 'Отключать микрофон', 'Отключать звук', 'Перемещать участников',
    'Voice Activity', 'Приоритетный режим'];
    
    const generalPermsList = translatedGeneralPerms.map((perm, i) => `${yesNo(role.permissions.has(generalPerms[i]))} ${perm}`).join('\n');
    const textPermsList = translatedTextPerms.map((perm, i) => `${yesNo(role.permissions.has(textPerms[i]))} ${perm}`).join('\n');
    const voicePermsList = translatedVoicePerms.map((perm, i) => `${yesNo(role.permissions.has(voicePerms[i]))} ${perm}`).join('\n');
  
    let desc = `ID: **\`${role.id}\`**\n`;
    desc += `Создана: **${Bot.toMoscowTime(role.createdAt)}**\n`;
    desc += `Цвет: **\`${role.hexColor}\`** ${role}\n\n`;
    desc += `**Настройки роли:**\n`;
    desc += `${yesNo(role.hoist)} Отображается отдельно от остальных\n`;
    desc += `${yesNo(role.mentionable)} Упоминается всеми\n\n`;
    desc += `**Основные права:**\n${generalPermsList}\n\n`;
    desc += `**Текстовые права:**\n${textPermsList}\n\n`;
    desc += `**Голосовые права:**\n${voicePermsList}`;

    const embed = new Bot.Discord.MessageEmbed()
    .setTitle(`Роль ${role.name}`)
    .setColor(Bot.colors.main)
    .setDescription(desc)
    message.channel.send(embed);
  }
};