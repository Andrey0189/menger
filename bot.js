const Discord = require('discord.js');
const fs = require('fs');
const mongoose = require('mongoose')

/** @namespace process.env.BOT_TOKEN */
/** @namespace process.env.DB_LINK */

mongoose.connect(process.env.DB_LINK, {useNewUrlParser: true, useUnifiedTopology: true}, err => {
  if (!err) console.log('Successfully connected to database');
  else console.log(err);
});

class Bot {
    constructor() {
        const _this = this;

        this.Discord = Discord;
        this.fs = fs;

        this.client = new Discord.Client({disableMentions: 'everyone'});
        this.client.login(process.env.BOT_TOKEN).then(() => delete process.env.BOT_TOKEN);

        this.userSchema = new mongoose.Schema({
            id: String,
            punishments: Object,
            raiting: Number
        });

        this.serverSchema = new mongoose.Schema({
            id: String,
            prefix: Array,
            mutedRole: String
        })

        this.users = mongoose.model('users', _this.userSchema);
        this.servers = mongoose.model('servers', _this.serverSchema);

        this.name = 'Menger';
        this.version = '1.0.0';

        this.creator = '242975403512168449';
        this.whitelist = [this.creator, '620541014662447124', '428036906723573760'];

        this.github = 'https://github.com/Andrey0189/menger';
        this.server = 'https://discord.gg/As5gZSQeEG';

        this.currentGames = [];

        this.colors = {
            discord: '#36393f',
            green: '#55ff55',
            red: '#ff5555',
            main: '#7289da'
        };

        this.emojis = {
            yes: '<:Yes:776788231794589696>',
            no: '<:No:776788252006678528>',
            offline: '<:offline:776834361332596766>',
            online: '<:online:776834339139878942>',
            idle: '<:idle:777329848712560690>',
            dnd: '<:dnd:777330015826083870>'
        };

        this.channels = {
            servers: '777335245111820329',
            commands: '777335269447041024',
            dm: '777335281477091338'
        }

        this.emoji = (id) => this.client.emojis.cache.get(id);

        this.random = (min, max) => Math.floor(Math.random() * (max + 1 - min)) + min;

        this.randomBoolean = () => Math.random() > 0.5? true : false;

        this.randomElement = arr => arr[Math.ceil(Math.random() * arr.length - 1)];

        this.addCommas = (int) => int.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

        this.toMoscowTime = (time) => time.toLocaleString('ru-RU', {timeZone: 'Europe/Moscow', hour12: false}).replace(/\/|\./g, '-');

        this.multipleReact = async (message, arr) => {
          if (0 in arr) await message.react(arr.shift()).then(() => _this.multipleReact(message, arr).catch());
        };

        this.declOfNum = (number, titles) => {  
            const cases = [2, 0, 1, 1, 1, 2];  
            return titles[(number % 100 > 4 && number % 100 < 20)? 2 : cases[(number % 10 < 5)? number % 10 : 5]];  
        };

        this.setBigTimeout = (func, timeout) => {
            if (timeout > 0x7FFFFFFF) setTimeout(function() {
                setBigTimeout(func, timeout-0x7FFFFFFF);
            }, 0x7FFFFFFF);

            else setTimeout(func, timeout);
        };

        this.getUser = async (id) => {
            let user = await _this.users.findOne({id: id});
            if (!user) {
                await (new _this.users({
                    id: id,
                    punishments: [],
                    raiting: 0
                })).save();
                user = await _this.getUser(id);
            };

            return user;
        };

        this.getServer = async (id) => {
            let server = await _this.servers.findOne({id: id});
            if (!server) {
                await (new _this.servers({
                    id: id,
                    prefix: _this.prefixes,
                    mutedRole: ''
                })).save();
                server = await _this.getServer(id);
            };

            return server;
        };

        this.punishMessage = (message, badGuy, act, reason, _dur) => {
            const isGood = Boolean(act.match(/раз/i));

            const embed = new _this.Discord.MessageEmbed()
            .setAuthor(isGood? 'Ваше наказание закончилось' : 'Вы были наказаны', message.guild.iconURL())
            .setColor(_this.colors[isGood? 'green' : 'red'])

            let res = '';
            res += `Вы были **${act}** на сервере "${message.guild.name}"\n`;
            res += `Пользователем: **${act.match(/авто/i)? 'Мной :)' : message.author.tag}**\n`;
            if (_dur) res += `Длительность: **\`${_dur}\`**\n`;
            res += `Причина: **${reason}**`;

            embed.setDescription(res);
            badGuy.send(embed);
        };
    

        this.commands = [];

        _this.client.on('ready', () => {

            this.footer = `<> with ❤ by ANDREY#2623`
            this.prefixes = ['=', `<@${this.client.user.id}>`];
            
            setInterval(() => _this.client.user.setActivity(`${_this.prefixes[0]}help | ${_this.client.guilds.cache.size} servers`, {type: 'PLAYING'}), 12e4);
            console.log(`${this.client.user.tag} is logged successfully.\nGuilds: ${this.client.guilds.cache.size}\nUsers: ${this.client.users.cache.size}`);
            
            
            fs.readdir('./Commands', (err, cmds) => {
                if (err) throw err;
                cmds.forEach(command => {
                    const cmd = require(`./Commands/${command}`);
                    this.commands.push({
                        name: cmd.name,
                        regex: cmd.regex,
                        args: cmd.args,
                        desc: cmd.desc,
                        example: cmd.example,
                        module: cmd.module,
                        private: cmd.private || false,
                        hidden: cmd.hidden || false,
                        run: cmd.run
                    });
                });
            });
        });

        _this.onMessage = async (message) => {
            if (message.author.bot) return;

            if (!message.guild) {
                const files = message.attachments.map(key => key.attachment)
                return _this.client.channels.cache.get(_this.channels.dm).send(`${message.author} \`[${message.author.tag}]\`: ${message.content}`, {files: files});
            };

            const msgPrefix = _this.prefixes.find(p => message.content.toLowerCase().startsWith(p));
            if (!msgPrefix) return;

            if (!message.channel.permissionsFor(message.guild.me).has('SEND_MESSAGES')) return message.author.send('Кажется, у меня нет прав для отправки сообщений в этот канал')

            const args = message.content.slice(msgPrefix.length).trim().split(/ +/g);
            const command = args.shift().toLowerCase();

            this.err = (desc) => message.channel.send(this.emojis.no + ' | ' + desc)
            this.suc = (desc) => message.channel.send(this.emojis.yes + ' | ' + desc)

            const cmd = _this.commands.find(c => command.match(new RegExp(`^${c.regex.toString().slice(1, -1)}$`)));
            
            if (cmd && (!cmd.private || _this.whitelist.includes(message.author.id))) {
                cmd.run(message, args);

                if (message.guild.id === '698150648470044744') return
                const embed = new _this.Discord.MessageEmbed()
                .setAuthor(message.author.tag, message.author.avatarURL())
                .setDescription(message.content)
                .setColor(_this.colors.main)
                .setFooter(message.guild.name, message.guild.iconURL());
                _this.client.channels.cache.get(_this.channels.commands).send(embed);
            };
        };
        
        _this.client.on('message', async msg => _this.onMessage(msg));
       // _this.client.on('messageUpdate', async (_oldMsg, msg) => _this.onMessage(msg));

        const server = async (guild, text, color) => {
            let bans = await guild.fetchBans().catch(err => err);
            if (bans.name) bans = 'Недостаточно прав';
            else bans = bans.size;

            const bots = guild.members.cache.filter(m => m.user.bot).size;
            const people = guild.memberCount - bots;    

            let desc = `Создан **${_this.toMoscowTime(guild.createdAt)}**\n`;
            desc += `Владелец: ${guild.owner}\n\n`;
            desc += `Участников: **\`${guild.memberCount}\`**\n`;
            desc += `👤 \`${people}\` | 🤖 \`${bots}\`\n\n`;
            desc += `Количество банов: **\`${bans}\`**\n\n`;

            const embed = new _this.Discord.MessageEmbed()
            .setTitle(`${text} ${guild.name}`)
            .setDescription(desc)
            .setColor(color)
            .setThumbnail(guild.iconURL({size: 1024, dynamic: true}))

            _this.client.channels.cache.get(_this.channels.servers).send(embed)
        };

        _this.client.on('guildCreate', async guild => {
            server(guild, `📥 Новый сервер`, _this.colors.green);
        });

        
        _this.client.on('guildDelete', async guild => {
            server(guild, `📥 Минус сервер`, _this.colors.red);
        });

        this.gameTemplate = async (message, allVariants, answers, gameName, question, raiting) => {
            const variants = [];
            const correctAnswer = _this.random(0, answers.length - 1);

            for (let i = 0; i < 6; i++) {
                variants.push(
                    _this.randomElement(answers.filter((f, i) => 
                        !variants.includes(f) && i !== correctAnswer
                    ))
                )
            };

            const correctAnswerNum = _this.random(1, variants.length);
            variants[correctAnswerNum - 1] = answers[correctAnswer];

            const embed = new _this.Discord.MessageEmbed()
            .setAuthor(gameName, message.author.avatarURL())
            .setDescription(`${message.member}, ${question} **${allVariants[correctAnswer]}**?`)
            .setColor(_this.colors.main)
            .setFooter(`Напишите номер правильного ответа внизу (У вас есть 10 секунд!)`);

            variants.forEach((variant, i) => {
                embed.addField(`${i + 1})`, `**${variant}**`, true); 
            });

            await message.channel.send(embed);
    
            const checkingForCmd = (m) => _this.prefixes.find(p => m.content.toLowerCase().startsWith(p));

            const filter = m => {
                const num = parseInt(m.content);
                return m.author.id === message.author.id && (!isNaN(num) && num <= variants.length && num > 0 || checkingForCmd(m))
            }

            message.channel.awaitMessages(filter, { max: 1, time: 11e3, errors: ['time'] })
            .then(async collected => {
                const msg = collected.first();

                if (checkingForCmd(msg)) return await _this.suc('Игра остановлена');

                const num = parseInt(msg.content);
                const dbUser = await _this.getUser(message.author.id + message.guild.id);

                if (num === correctAnswerNum) {
                    dbUser.raiting += raiting.toAdd; 
                    _this.suc(`Ты выиграл! Правильный ответ: **${correctAnswerNum}) ${answers[correctAnswer]}**\nТвой рейтинг: 🔰 **\`${dbUser.raiting}\`** (+${raiting.toAdd})`);
                } else {
                    if (dbUser.raiting < raiting.toRemove) dbUser.raiting = 0;
                    else dbUser.raiting -= raiting.toRemove;
                    _this.err(`Ты проиграл 😆! Правильный ответ: **${correctAnswerNum}) ${answers[correctAnswer]}**\nТвой рейтинг: 🔰 **\`${dbUser.raiting}\`** (-${raiting.toRemove})`);
                };

                await _this.users.updateOne({id: dbUser.id}, dbUser);
            })

            .catch(() => {
                message.reply('Время вышло! Ты проиграл 😆')
            });
        };

        this.games = {
            countries: ['Зимбабве', 'Хорватия', 'Латвия', 'Казахстан', 'Россия', 'Греция',
            'Дания', 'Уганда', 'Финляндия', 'Беларусь', 'Румыния', 'Албания', 'Швейцария',
            'Монако', 'Польша', 'Италия', 'США', 'Британия', 'Португалия', 'Турция',
            'Египет', 'Индия', 'Австралия', 'Новая Зеландия', 'Сингапур', 'Малайзия', 'Пакистан',
            'Бангладеш', 'Австрия', 'Венгрия', 'Непал', 'Индонезия', 'Уругвай', 'Парагвай',
            'Аргентина', 'Чили', 'Куба', 'Перу', 'Сирия', 'Ирак', 'Иран',
            'Чехия', 'Филипины', 'Бенин', 'Белиз', 'Суринам', 'Габон', 'Того',
            'Мозамбик', 'Руанда', 'Бурунди', 'Экваториальная Гвинея', 'Камерун', 'Конго', 'Черногория',
            'Йемен', 'Восточный Тимор', 'Гамбия', 'Сенегал', 'Мали', 'Нигер (Да-да)', 'Чад',
            'Ангола', 'Шри-Ланка', 'Бутан', 'Мьянма', 
            ],
            
            flags: ['zw', 'hr', 'lv', 'kz', 'ru', 'gr',
            'dk', 'ug', 'fi', 'by', 'ro', 'al', 'ch',
            'mc', 'pl', 'it', 'us', 'gb', 'pt', 'tr',
            'eg', 'in', 'au', 'nz', 'sg', 'my', 'pk',
            'bd', 'at', 'hu', 'np', 'id', 'uy', 'py',
            'ar', 'cl', 'cu', 'pf', 'sy', 'iq', 'ir',
            'cz', 'ph', 'bj', 'bz', 'sr', 'ga', 'tg',
            'mz', 'rw', 'bi', 'gq', 'cm', 'cg', 'me',
            'ye', 'tl', 'gm', 'sn', 'ml', 'ne', 'td',
            'ao', 'lk', 'bt', 'mm',
            ],

            capitals: ['Хараре', 'Загреб', 'Рига', 'Астана', 'Москва', 'Афины',
            'Копенгаген', 'Кампала', 'Хельсинки', 'Минск', 'Бухарест', 'Тирана', 'Берн',
            'Монако', 'Варшава', 'Рим', 'Вашингтон', 'Лондон', 'Лиссабон', 'Анакара',
            'Каир', 'Нью-Дели', 'Канберра', 'Веллингтон', 'Сингапур', 'Куала-Лумпур', 'Исламабад',
            'Дакка', 'Вена', 'Будапешт', 'Катманду', 'Джакарта', 'Монтевидео', 'Асунсьон',
            'Буэнос-Айрес', 'Сантьяго', 'Гавана', 'Лима', 'Дамаск', 'Багдад', 'Тегеран',
            'Прага', 'Манила', 'Порто-Ново', 'Бельмопан', 'Парамарибо', 'Либревиль', 'Ломе',
            'Мапуто', 'Кигали', 'Гитега', 'Малабо', 'Яунде', 'Браззавиль', 'Подгорица',
            'Сана', 'Дили', 'Банжул', 'Дакар', 'Бамако', 'Ниамей', 'Нджамена', 
            'Луанда', 'Коломбо', 'Тхимпху', 'Нейпьидо',
            ]
        }
    };
};

global.Bot = new Bot();
