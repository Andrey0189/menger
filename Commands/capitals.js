module.exports = {
  name: 'capitals',
  regex: /capitals/,
  desc: 'Игра с угадыванием столиц',
  module: 'games',
  run: async (message) => {
    // message, allVariants, answers, gameName, question, raiting
    Bot.gameTemplate(
      message,
      Bot.games.countries,
      Bot.games.capitals,
      'Угадай столицу страны',
      'Какая столица у страны',
      { toAdd: 15, toRemove: 10 }
    );  
  }
};