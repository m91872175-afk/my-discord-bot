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

// نظام الترحيب
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

// الأوامر
client.on('messageCreate', async message => {
    if (message.author.bot) return;
    const args = message.content.split(' ');
    const command = args[0];

    // الرد على السلام
    if (message.content === 'السلام عليكم') {
        message.reply('عليكم السلام ورحمة الله وبركاته ارحب');
    }

    // أمر مسح (مثال: مسح 5)
    if (command === 'مسح') {
        const count = parseInt(args[1]);
        if (!count) return message.reply('حدد عدد الرسائل!');
        await message.channel.bulkDelete(count + 1, true).catch(() => {});
        const msg = await message.channel.send(`تم حذف ${count} رسالة.`);
        setTimeout(() => msg.delete().catch(() => {}), 3000);
    }

    // أمر انطم (مثال: انطم @فلان 1m)
    if (command === 'انطم') {
        const user = message.mentions.members.first();
        if (!user) return message.reply('حدد الشخص!');
        try {
            await user.timeout(60 * 1000, 'تم إسكاته بواسطة الإدارة');
            message.channel.send(`تم إسكات ${user.user.tag} لمدة دقيقة.`);
        } catch (err) {
            message.reply('ما قدرت، تأكد من صلاحياتي!');
        }
    }

    // أمر بنعالي (الباند)
    if (command === 'بنعالي') {
        const user = message.mentions.members.first();
        if (!user) return message.reply('حدد الشخص اللي تبي تعطيه "بنعالي"! 👟');
        try {
            await user.ban({ reason: 'تم تصريفه بنعالي!' });
            message.channel.send(`تم طرد ${user.user.tag} بالنعالي بنجاح! 👟💥`);
        } catch (err) {
            message.reply('ما قدرت أطرده، تأكد أن رتبتي أعلى من رتبته!');
        }
    }
});

client.login(process.env.TOKEN);
