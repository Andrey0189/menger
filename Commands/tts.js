module.exports = {
  name: 'tts',
  regex: /tts/,
  desc: 'Произнести любую фразу на русском или на английском',
  args: ['<ru | en>', '<текст>'],
  example: 'tts ru привет',
  run: (message, args) => {
    if (!args[0]) return Bot.err('Не указан язык. (en или ru)');
    if (!args[1]) return Bot.err('Не указан текст');
    const text = args.slice(1).join();
    const lang = args[0].toLowerCase();

    Bot.googleTTS(text.slice(0, 200), lang, 1).then(url => {
        const file = new Bot.Discord.MessageAttachment(url, 'tts.mp3');
        message.channel.send(file);
    })
  }
};