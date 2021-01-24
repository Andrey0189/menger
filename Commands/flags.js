module.exports = {
  name: 'flags',
  regex: /flags/,
  desc: 'Игра с угадыванием флагов',
  module: 'games',
  run: async (message) => {
    // message, allVariants, answers, gameName, question, raiting
    Bot.gameTemplate(
      message,
      Bot.games.countries,
      Bot.games.flags.map(f => `:flag_${f}:`),
      'Угадай флаг страны',
      'Какой флаг у страны',
      { toAdd: 10, toRemove: 8 }
    );  
  }
};