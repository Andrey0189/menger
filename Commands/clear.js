module.exports = {
  name: 'clear',
  regex: /clear/,
  desc: 'Очистить сообщения',
  args: ['<число>'],
  example: 'clear 10',
  module: 'mod',
  run: async (message, args) => {
    if (!message.member.hasPermission('MANAGE_MESSAGES')) return Bot.err('Вам нужно право "Управление сообщениями" для использования этой команды');
    if (!message.guild.me.hasPermission('MANAGE_MESSAGES')) return Bot.err(`У меня нет права "Управление сообщениями"`);

    const clearNum = parseInt(args[0]);
    if (isNaN(clearNum)) return Bot.err('Вы указали неправильное число');
    if (clearNum > 100 || clearNum < 1) return Bot.err('Количество удаленных сообщений не может быть больше 100 и меньше 1');

    await message.channel.bulkDelete(clearNum + 1);

    const msgToDelete = await Bot.suc(`Было удалено **\`${clearNum}\`** ${Bot.declOfNum(clearNum, ['сообщение', 'сообщения', 'сообщений'])}`);
    msgToDelete.delete({ timeout: 5e3 });
  }
};