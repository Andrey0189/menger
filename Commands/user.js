module.exports = {
  name: 'user',
  regex: /user/,
  desc: 'Информация о пользователе',
  args: ['[@пользователь | тэг | ID]'],
  example: 'user @чел#1234',
  module: 'util',
  run: async (message, args) => {
    const matchArgs = new RegExp(args[0], 'i');
    let user = message.mentions.users.first() || Bot.client.users.cache.find(u => u.id === args[0] || (args[0] && u.tag.match(matchArgs)));
    if (args[0] && !user) return Bot.err('Пользователь не найден');
    if (!args[0]) user = message.author;
    const member = message.guild.member(user)

    const translatedStates = ['Браузера 🌐', 'Клиента 🖥️', 'Телефона 📱'];
    const clientStatesNames = ['web', 'desktop', 'mobile'];

    let finalStates;
    if (!user.presence.clientStatus) finalStates = ['Неизвестно или оффлайн ❔'];
    else finalStates = Object.keys(user.presence.clientStatus).map(state => {
      for (let i = 0; i < clientStatesNames.length; i++) {
        if (state === clientStatesNames[i]) return translatedStates[i]
      };  
    })

    let desc = `${user} **\`${user.tag}\`**\n`;
    desc += `Аккаунт создан: **${Bot.toMoscowTime(user.createdAt)}**\n`;
    if (member) desc += `Зашел на сервер: **${Bot.toMoscowTime(member.joinedAt)}**\n`;
    desc += `\nСидит с: **${finalStates.join(', ')}**\n`

    const embed = new Bot.Discord.MessageEmbed()
    .setAuthor(`Пользователь ${user.tag}`, user.avatarURL())
    .setColor(Bot.colors.main)
    .setThumbnail(user.avatarURL({size: 1024, dynamic: true}))
    .setDescription(desc);
    message.channel.send({embed});
  }
};