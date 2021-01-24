module.exports = {
  name: 'emoji',
  regex: /emoji/,
  desc: 'Информация об эмодзи на сервере',
  args: ['[эмодзи]'],
  example: 'emoji :lol:',
  module: 'util',
  run: async (message, args) => {
    if (!args[0]) return Bot.err('Пустотный эмодзи???');
    const matchArgs = new RegExp(args[0], 'i');
    const emoji = message.guild.emojis.cache.find(e => e.toString() === args[0] || e.name.match(matchArgs));
    if (!emoji) return Bot.err(`Я не нашел эмодзи ${args[0]} на этом сервере`);

    let author = 'Нет права "Управление эмодзи"';
    if (message.guild.me.hasPermission('MANAGE_EMOJIS')) {
      author = await emoji.fetchAuthor();
      author = `${author} **\`${author.tag}\`**`;
    };

    let desc = `Добавлен: **${Bot.toMoscowTime(emoji.createdAt)}**\n`;
    desc += `Добавил: ${author}\n\n`;
    desc += `Идентификатор: **\`${emoji}\`**\n`;
    desc += `[Ссылка](${emoji.url})`;
    
    const embed = new Bot.Discord.MessageEmbed()
    .setTitle(`Эмодзи ${emoji}`)
    .setColor(Bot.colors.main)
    .setThumbnail(emoji.url)
    .setDescription(desc)
    message.channel.send({embed})
  }
}