const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

client.once('clientReady', () => {
    console.log(`تم تسجيل الدخول بنجاح باسم ${client.user.tag}`);
});

// نظام الترحيب أول ما يدخل شخص جديد للسيرفر
client.on('guildMemberAdd', member => {
    const welcomeChannel = member.guild.channels.cache.find(channel => channel.name === 'welcome');
    if (!welcomeChannel) return;

    const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('🎉 عضو جديد انضم إلينا!')
        .setDescription(`أهلاً بك يا ${member} في سيرفرنا! نورتنا وشرفت بوجودك 🌹`)
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
        .setFooter({ text: `أنت العضو رقم ${member.guild.memberCount}` })
        .setTimestamp();

    welcomeChannel.send({ embeds: [embed] });
});

// الأوامر النصية والتحكم
client.on('messageCreate', async message => {
    if (message.author.bot) return;

    // 1. قائمة المساعدة (!help)
    if (message.content === '!help') {
        const helpEmbed = new EmbedBuilder()
            .setColor('#2ecc71')
            .setTitle('🤖 قائمة أوامر بوت System 3np')
            .setDescription('هذه هي الأوامر المتاحة حالياً في البوت:')
            .addFields(
                { name: '`!ping`', value: 'للتحقق من سرعة استجابة البوت.', inline: false },
                { name: '`!clear [عدد]`', value: 'لمسح الرسائل (خاص بالإدارة).', inline: false },
                { name: '`!timeout @الشخص [الدقائق]`', value: 'لإعطاء تايم أوت للعضو.', inline: false },
                { name: '`السلام عليكم`', value: 'يرد عليك البوت تلقائياً.', inline: false }
            )
            .setFooter({ text: 'تم تطوير البوت بواسطة System 3np' });

        return message.reply({ embeds: [helpEmbed] });
    }

    // 2. أمر البينج (!ping)
    if (message.content === '!ping') {
        message.reply('Pong! 🏓 البوت شغال وسريع.');
    }

    // 3. رد تلقائي على السلام
    if (message.content === 'السلام عليكم') {
        message.reply('وعليكم السلام ورحمة الله وبركاته! نورت السيرفر 🌹');
    }

    // 4. أمر مسح الرسائل (!clear [عدد])
    if (message.content.startsWith('!clear')) {
        const args = message.content.split(' ');
        const count = parseInt(args[1]);
        
        if (!count) {
            return message.reply('اكتب عدد الرسائل اللي تبي تمسحها! مثال: `!clear 10`');
        }
        
        try {
            await message.channel.bulkDelete(count + 1, true);
            const msg = await message.channel.send(`تم مسح ${count} رسالة بنجاح!`);
            setTimeout(() => msg.delete().catch(() => {}), 3000);
        } catch (err) {
            message.reply('عذراً، تأكد من صلاحياتي أو أن الرسائل ليست أقدم من 14 يوماً!');
        }
    }

    // 5. أمر التايم أوت (!timeout @الشخص [الدقائق])
    if (message.content.startsWith('!timeout')) {
        if (!message.member.permissions.has('ModerateMembers')) {
            return message.reply('ما عندك صلاحية تسوي تايم أوت!');
        }

        const user = message.mentions.members.first();
        const args = message.content.split(' ');
        const minutes = parseInt(args[2]);

        if (!user || !minutes) {
            return message.reply('الطريقة الصحيحة: `!timeout @الشخص [عدد الدقائق]`');
        }

        try {
            await user.timeout(minutes * 60 * 1000, 'تم إعطاؤه تايم أوت بواسطة الإدارة');
            message.channel.send(`تم إعطاء تايم أوت لـ ${user.user.tag} لمدة ${minutes} دقيقة.`);
        } catch (err) {
            message.reply('ما قدرنا نعطيه تايم أوت، تأكد أن رتبة البوت أعلى من رتبته ولديك الصلاحيات!');
        }
    }
});

client.login(process.env.TOKEN);
