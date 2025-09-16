require('dotenv').config();
const express = require('express');
const TelegramBot = require('node-telegram-bot-api');

const app = express();
const PORT = process.env.PORT || 3000;
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

if (!BOT_TOKEN) {
    console.error("❌ Укажи TELEGRAM_BOT_TOKEN в .env");
    process.exit(1);
}

// Храним сообщения в массиве (можно заменить на файл/БД)
let messages = [];

// Создаём бота (long polling)
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// Слушаем ВСЕ входящие сообщения
bot.on('message', (msg) => {
    const entry = {
        chatId: msg.chat.id,
        from: msg.from.username || `${msg.from.first_name} ${msg.from.last_name || ''}`,
        text: msg.text,
        date: new Date(msg.date * 1000).toISOString()
    };
    messages.push(entry);
    console.log("📩 Новое сообщение:", entry);
});

// Роут для просмотра всех сообщений
app.get('/messages', (req, res) => {
    res.json(messages);
});

// Главная страница
app.get('/', (req, res) => {
    res.send(`
    <h1>Сообщения из Telegram</h1>
    <p>Открой <a href="/messages">/messages</a> чтобы посмотреть JSON</p>
  `);
});

app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен: http://localhost:${PORT}`);
});
