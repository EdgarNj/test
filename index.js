require('dotenv').config();
const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

if (!BOT_TOKEN) {
    console.error('❌ Укажи TELEGRAM_BOT_TOKEN в .env');
    process.exit(1);
}

// Файл для хранения chat_id (можно заменить на БД)
const CHAT_FILE = 'chats.json';
let chatIds = [];
if (fs.existsSync(CHAT_FILE)) {
    chatIds = JSON.parse(fs.readFileSync(CHAT_FILE, 'utf8'));
}

// Создаём Telegram-бота (long polling)
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// При /start сохраняем chat_id
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    if (!chatIds.includes(chatId)) {
        chatIds.push(chatId);
        fs.writeFileSync(CHAT_FILE, JSON.stringify(chatIds, null, 2));
        console.log(`✅ Новый chat_id добавлен: ${chatId}`);
    }
    bot.sendMessage(chatId, "Привет 👋 Теперь ты будешь получать уведомления с сайта!");
});

// Функция отправки уведомлений во все chat_id
function notifyAll(text) {
    chatIds.forEach(id => {
        bot.sendMessage(id, text, { parse_mode: 'HTML' })
            .catch(err => console.error("Ошибка отправки:", err.response?.body || err.message));
    });
}

// Роут /test
app.get('/test', (req, res) => {
    const now = new Date().toISOString();
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const ua = req.get('User-Agent') || 'unknown';

    const message = `<b>🔔 Посещение сайта</b>\n<b>Время:</b> ${now}\n<b>IP:</b> <code>${ip}</code>\n<b>User-Agent:</b> ${ua}`;

    notifyAll(message);

    res.send('privet edgar');
});

app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен: http://localhost:${PORT}`);
});
