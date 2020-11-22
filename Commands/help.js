module.exports = {
  name: 'help',
  regex: /help/,
  args: ['[command]'],
  desc: 'Ты серьезно?',
  hidden: true,
  example: 'help embed',
  run: (message, args) => {
    if (!args[0]) {
      message.channel.send(`Привет.\n\n**Menger \`[Менгер]\`** - это универсальный бот для вашего сервера\n\n**\`${Bot.prefixes[0]}help commands\`**\nСписок команд\n\n**\`${Bot.client.users.cache.get(Bot.creator).tag}\`**\nСоздатель бота\n\n⚠️ Это бета-версия версия бота, поэтому могут встречаться баги. Напишите разработчику, если вы нашли баг\n\nНаш сервер: ${Bot.server}`)
    
    } else if (args[0] === 'commands') {
      const helpCommands = Bot.commands.filter(c => !c.private && !c.hidden)
      const arr = helpCommands.map(cmd => `◽ **${Bot.prefixes[0] + cmd.name} ${cmd.args?`\`${cmd.args.join(' ')}\``:''} -** ${cmd.desc}`);
      
      const embed = new Bot.Discord.MessageEmbed()
      .setAuthor('Помощь по командам', message.author.avatarURL())
      .setDescription(`Напишите ${Bot.prefixes[0]}help **\`<название-команды>\`** для помощи по отдельной команде\n**\`<...>\`** - Обязательный параметр.\n**\`[...]\`** - Необязательный параметр.\n**\`|\`** - Оператор "или"\n\n${arr.join('\n')}`)
      .setColor(Bot.colors.main)
      .setFooter(Bot.footer)
      message.channel.send(embed);

    } else {
      const helpCmd = Bot.commands.find(c => args[0].match(c.regex));
      if (!helpCmd) return Bot.err(`Команда ${args[0]} не найдена`)
      message.channel.send(`**Команда:** ${Bot.prefixes[0] + helpCmd.name} ${helpCmd.args? `\`${helpCmd.args}\`` : ''}\n**Описание:** ${helpCmd.desc}\n**Пример:** ${helpCmd.example? '```' + Bot.prefixes[0] + helpCmd.example + '```' : 'Не найден'}`);
    };
  }
};
