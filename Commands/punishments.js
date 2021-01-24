module.exports = {
  name: 'punishments',
  regex: /punishments/,
  desc: 'Посмотреть нарушения участника',
  args: ['<@участник | тэг>'],
  example: 'punishments @чел#1234',
  module: 'mod',
  run: async (message, args) => {
    const matchArgs = new RegExp(args[0], 'i')
    let member = message.mentions.members.first() || message.guild.members.cache.find(m => m.user.tag.match(matchArgs));
    if (args[0] && !member) return Bot.err('Пользователь не найден');
    if (!args[0]) member = message.member;

    const dbMember = await Bot.getUser(member.id + message.guild.id);

    const punList = dbMember.punishments.map((p, i) => {
      let res = `${i + 1}. \`${Bot.toMoscowTime(new Date(p.date))}\` `;
      res += `**${p.type.slice(0, 1).toUpperCase() + p.type.slice(1)}**`;
      res += ` - ${p.reason}`;
      return res;
    })

    message.channel.send(punList.join('\n')).catch(() => message.channel.send('Этот участник еще ничего не нарушил 👼'));
  }
};