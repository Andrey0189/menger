module.exports = {
  name: 'help',
  regex: /help/,
  args: ['[command]'],
  desc: 'Ты серьезно?',
  hidden: true,
  example: 'help embed',
  module: 'util',
  run: async (message, args) => {
    const cmdList = Bot.commands.filter(c => !c.private && !c.hidden && c.module);
    const modules = [];

    cmdList.forEach(c => {
      if (!modules.find(m => m.name === c.module)) modules.push({
        name: c.module,
        fullName: '',
        cmdNum: cmdList.filter(cmd => cmd.module === c.module).length
      });
    });

    if (!args[0]) {
      message.channel.send(`Привет.\n\n**Menger \`[Менгер]\`** - это универсальный бот для вашего сервера\nНа данный момент у меня **\`${cmdList.length}\`** ${Bot.declOfNum(cmdList.length, ['команда', 'команды', 'команд'])}\n\n**\`${Bot.prefixes[0]}help modules\`**\nСписок модулей команд.\n\n**\`${Bot.client.users.cache.get(Bot.creator).tag}\`**\nСоздатель бота.\n\n⚠️ Это бета-версия версия бота, поэтому могут встречаться баги. Напишите разработчику, если вы нашли баг\n\nНаш сервер: ${Bot.server}`)
    
    } else if (args[0] === 'modules') {

      const embed = new Bot.Discord.MessageEmbed()
      .setAuthor('Список модулей', message.author.avatarURL())
      .setColor(Bot.colors.main)
      .setDescription(`Напишите номер модуля внизу\nдля списка команд\n\n${modules.map((m, i) => `**\`${i + 1}\` ${m.name}** (${m.cmdNum} ${Bot.declOfNum(m.cmdNum, ['команда', 'команды', 'команд'])})`).join('\n')}`)
      .setFooter('Пишите только число')
      await message.channel.send(embed);
      
      stylize = (module) => {
        return cmdList.filter(cmd => cmd.module === module).map(cmd => `◽ **${Bot.prefixes[0] + cmd.name} ${cmd.args?`\`${cmd.args.join(' ')}\``:''} -** ${cmd.desc}`);
      };

      const filter = m => m.author.id === message.author.id && !isNaN(parseInt(m.content));

      message.channel.awaitMessages(filter, { max: 1, time: 6e4, errors: ['time'] })
      .then(async collected => {
        const msg = collected.first();
        const moduleInt = parseInt(msg.content);
        const selectedModule = modules[moduleInt - 1];

        const moduleCommands = stylize(selectedModule.name);

        const embed = new Bot.Discord.MessageEmbed()
        .setAuthor(`Команды модуля ${selectedModule.name}`, message.author.avatarURL())
        .setDescription(`Напишите ${Bot.prefixes[0]}help **\`<название-команды>\`** для помощи по отдельной команде\n**\`<...>\`** - Обязательный параметр.\n**\`[...]\`** - Необязательный параметр.\n**\`|\`** - Оператор "или"`)
        .setDescription(moduleCommands)
        .setColor(Bot.colors.main)
        .setFooter(Bot.footer)
        message.channel.send(embed);
      });

    } else if (args[0] === 'commands') {
      message.channel.send(`${Bot.prefixes[0]}help commands больше не работает, пишите ${Bot.prefixes[0]}help modules`);
    } else {
      const helpCmd = Bot.commands.find(c => args[0].match(c.regex));
      if (!helpCmd) return Bot.err(`Команда ${args[0]} не найдена`)
      message.channel.send(`**Команда:** ${Bot.prefixes[0] + helpCmd.name} ${helpCmd.args? `\`${helpCmd.args}\`` : ''}\n**Описание:** ${helpCmd.desc}\n**Пример:** ${helpCmd.example? '```' + Bot.prefixes[0] + helpCmd.example + '```' : 'Не найден'}`);
    };
  }
};
