const Discord = require('discord.js');
const fs = require('fs');
const googleTTS = require('google-tts-api');

/** @namespace process.env.BOT_TOKEN */

class Bot {
    constructor() {
        let _this = this;

        this.Discord = Discord;
        this.fs = fs;
        this.googleTTS = googleTTS;

        this.client = new Discord.Client({disableEveryone: true});
        this.client.login(process.env.BOT_TOKEN).then(() => delete process.env.BOT_TOKEN);

        this.name = 'Menger';
        this.version = '1.0.0';

        this.creator = '242975403512168449';
        this.whitelist = [this.creator, '620541014662447124'];

        this.github = 'https://github.com/Andrey0189/menger';
        this.server = 'https://discord.gg/As5gZSQeEG';

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
                _this.client.channels.cache.get(_this.channels.dm).send(`${message.author} \`[${message.author.tag}]\`: ${message.content}`, {files: files});
            };

            const msgPrefix = _this.prefixes.find(p => message.content.toLowerCase().startsWith(p));
            if (!msgPrefix) return;

            if (!message.channel.permissionsFor(message.guild.me).has('SEND_MESSAGES')) return message.author.send('Кажется, у меня нет прав для отправки сообщений в этот канал')

            const args = message.content.slice(msgPrefix.length).trim().split(/ +/g);
            const command = args.shift().toLowerCase();

            this.err = (desc) => message.channel.send(this.emojis.no + ' | ' + desc)
            this.suc = (desc) => message.channel.send(this.emojis.yes + ' | ' + desc)

            const cmd = _this.commands.find(c => command.match(c.regex));
            
            if (cmd && (!cmd.private || _this.whitelist.includes(message.author.id))) {
                cmd.run(message, args);

                if (message.guild.id === '776787554489860096') return
                const embed = new _this.Discord.MessageEmbed()
                .setAuthor(message.author.tag, message.author.avatarURL())
                .setDescription(message.content)
                .setColor(_this.colors.main)
                .setFooter(message.guild.name, message.guild.iconURL());
                _this.client.channels.cache.get(_this.channels.commands).send(embed);
            };
        };
        
        _this.client.on('message', async msg => _this.onMessage(msg));
        //_this.client.on('messageUpdate', async (_oldMsg, msg) => _this.onMessage(msg));

        const server = async (guild, text, color) => {
            const invite = 'discord.gg/';
            if (guild.me && guild.me.hasPermission('CREATE_INSTANT_INVITE')) {
                const invites = await guild.fetchInvites();
                invite += invites.first()? invites.first().code : '';
            };

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

            _this.client.channels.cache.get(_this.channels.servers).send(invite, embed)
        };

        _this.client.on('guildCreate', async guild => {
            server(guild, `📥 Новый сервер`, _this.colors.green);
        });

        
        _this.client.on('guildDelete', async guild => {
            server(guild, `📥 Минус сервер`, _this.colors.red);
        });
    };
};

global.Bot = new Bot();
