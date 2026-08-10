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

// نظام الترحيب أول ما يدخل شخص جديد للسيرفر (مثل ProBot)
client.on('guildMemberAdd', member => {
    // حدد هنا اسم روم الترحيب حقك (تأكد أن الروم موجود في سيرفرك باسم welcome)
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

// الأوامر النصية
client.on('messageCreate', async message => {
    if (message.author.bot) return;

    // أمر المساعدة (!help) بشكل فخم زي بروبوت
    if (message.content === '!help') {
        const helpEmbed = new EmbedBuilder()
            .setColor('#2ecc71')
            .setTitle('🤖 قائمة أواكر بوت System 3np')
            .setDescription('هذه هي الأوامر المتاحة حالياً في البوت:')
            .addFields(
                { name: '`!ping`', value: 'لتحقق من سرعة استجابة البوت.', inline: false },
                { name: '`!clear [عدد]`', value: 'لمسح الرسائل (خاص بالإدارة).', inline: false },
                { name: '`السلام عليكم`', value: 'يرد عليك البوت تلقائياً.', inline: false }
            )
            .setFooter({ text: 'تم تطوير البوت بواسطة System 3np' });

        return message.reply({ embeds: [helpEmbed] });
    }

    if (message.content === '!ping') {
        message.reply('Pong! 🏓 البوت شغال وسريع.');
    }

    if (message.content === 'السلام عليكم') {
        message.reply('وعليكم السلام ورحمة الله وبركاته! نورت السيرفر 🌹');
    }

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
});

client.login(process.env.TOKEN);
