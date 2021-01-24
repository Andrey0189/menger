module.exports = {
  name: 'top',
  regex: /l(eader)?b(oard?)|top/,
  desc: 'Лучшие игроки сервера',
  module: 'games',  
  run: async (message, args) => {
    let page = parseInt(args[1]) || 1;
    const matchServer = new RegExp(message.guild.id);
    
    const allUsers = await Bot.users.find({});
    const data = allUsers.filter(u => u.id.match(matchServer));

    const maxElements = 10;
    const maxPages = Math.ceil(data.length / maxElements);

    getID = (dbUser) => dbUser.id.slice(0, -message.guild.id.length);
  
    book = (page) => {
      const arr = [];
      const embed = new Bot.Discord.MessageEmbed()
      .setAuthor(`Лучшие игроки сервера ${message.guild.name}`, message.guild.iconURL())
      .setColor(Bot.colors.main)
      .setFooter(`Page ${page}/${maxPages}`);
  
      data.sort((a, b) => b.raiting - a.raiting).filter(u => Bot.client.users.cache.get(getID(u)) && u.raiting).forEach((u, index) => {
        const usr = Bot.client.users.cache.get(getID(u)).tag;
        const field = `${index + 1}. ${usr}`
        if (index + 1 <= page * maxElements && index + 1 > (page - 1) * maxElements) arr.push(`${field + (' ').repeat(42 - field.length)}🔰 ${u.raiting}`)
      });
  
      const top = arr.join('\n');
      return embed.setDescription(`\`\`\`${top}\`\`\``);
    };
  
    message.channel.send(book(page)).then(msg => {
      Bot.multipleReact(msg, ['◀', '▶']);
      const reactCollector = new Bot.Discord.ReactionCollector(msg, r => r.users.cache.find(u => u.id === message.author.id), {time: 3e5});
      reactCollector.on('collect', (reaction) => {
        const reactionAuthor = reaction.users.cache.find(u => u.id === message.author.id)
        reaction.users.remove(reactionAuthor);
        if (reaction.emoji.name === '◀') {
          if (page === 1) page = maxPages
          else page--;
          msg.edit({embed: book(page)});
        } else if (reaction.emoji.name === '▶') {
          if (page === maxPages) page = 1
          else page++;
          msg.edit({embed: book(page)});
        };
      });
    });
  }
};
