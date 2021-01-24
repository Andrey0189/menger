module.exports = {
  name: 'random',
  regex: /rand(om)?/,
  args: ['[число]', '[число]'],
  desc: 'Генератор случайных чисел',
  example: 'rand 1 100',
  module: 'util',
  run: async (message, args) => {
      let num1 = parseInt(args[0]);
      let num2 = parseInt(args[1]);
      if (isNaN(num1)) num1 = 10;
      if (isNaN(num2)) num2 = 1;
  
      if (num1 > num2) {
          let num3 = num2;
          num2 = num1;
          num1 = num3;
      }
  
      const randomNum = Bot.random(num1, num2);
      message.channel.send(`Число от ${num1} до ${num2}:\n\n🎲 **${randomNum}** 🎲`);
  }
};
