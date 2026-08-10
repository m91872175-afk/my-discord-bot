const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');

// إنشاء البوت مع الصلاحيات المطلوبة
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
});

// هذا السطر يقرأ التوكن من إعدادات Render (Environment Variables)
const TOKEN = process.env.TOKEN; 
const PREFIX = '!'; 

client.once('ready', () => {
    console.log(`تم تسجيل الدخول بنجاح باسم: ${client.user.tag}`);
    client.user.setActivity('سيرفرك | !help', { type: 3 });
});

client.on('messageCreate', async message => {
    if (message.author.bot) return;
    if (!message.content.startsWith(PREFIX)) return;

    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    // أمر البنغ
    if (command === 'ping') {
        const msg = await message.reply('جاري قياس السرعة...');
        const latency = msg.createdTimestamp - message.createdTimestamp;
        msg.edit(`Pong! 🏓\nسرعة الاستجابة: ${latency}ms`);
    }

    // أمر الحظر (بنعالي) - اللي طلبته
    else if (command === 'بنعالي') {
        if (!message.member.permissions.has('BanMembers')) {
            return message.reply('عذراً، أنت لا تمتلك صلاحية لحظر الأعضاء! ❌');
        }

        const target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        
        if (!target) {
            return message.reply('يرجى منشن الشخص الذي تريد حظره! مثال: `!بنعالي @فلان`');
        }

        if (!target.bannable) {
            return message.reply('لا يمكنني حظر هذا الشخص، قد تكون رتبته أعلى مني! ⚠️');
        }

        const reason = args.slice(1).join(' ') || 'لم يتم ذكر سبب';

        try {
            await target.ban({ reason: reason });
            const banEmbed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('🔨 تم تنفيذ الحكم (بنعالي)')
                .setDescription(`تم حظر **${target.user.tag}** من السيرفر.`)
                .addFields({ name: 'السبب:', value: reason })
                .setTimestamp();

            message.channel.send({ embeds: [banEmbed] });
        } catch (error) {
            console.error(error);
            message.reply('حدث خطأ أثناء محاولة الحظر.');
        }
    }
    
    // أمر المساعدة
    else if (command === 'help') {
        message.reply('أوامر البوت:\n!ping - لقياس السرعة\n!بنعالي @العضو - لحظر شخص');
    }
});

// تشغيل البوت
client.login(TOKEN);
