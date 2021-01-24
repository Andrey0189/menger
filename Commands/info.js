module.exports = {
  name: 'info',
  regex: /info/,
  desc: 'Информация о боте',
  module: 'misc',
  run: (message) => {
      const embed = new Bot.Discord.MessageEmbed()
      .setAuthor('Информация о боте', message.author.avatarURL())
      .addField('Базовая информация', `**Сервера: \`${Bot.addCommas(Bot.client.guilds.cache.size)}\`\nКаналы: \`${Bot.addCommas(Bot.client.channels.cache.size)}\`\nПользователи: \`${Bot.addCommas(Bot.client.users.cache.size)}\`\n\nОЗУ: \`${Bot.addCommas(Math.round(process.memoryUsage().rss / 1024 / 1024 ))}/1,024 MB\`**`)
      .addField('Разработчики', `**${Bot.client.users.cache.get(Bot.creator)} \`${Bot.client.users.cache.get(Bot.creator).tag}\`**`)
      .setTitle('Пригласить бота')
      .setURL(`https://discordapp.com/oauth2/authorize?client_id=${Bot.client.user.id}&scope=bot&permissions=3533888`)
      .setColor(Bot.colors.main);
      message.channel.send(embed);
  }
};
