const express = require('express');
const app = express();

// Роут /test
app.get('/test', (req, res) => {
    const now = new Date().toISOString();
    console.log(`[${now}] Кто-то зашёл на /test. IP: ${req.ip}`);

    res.send('privet edgar');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`API запущен: http://localhost:${PORT}`);
});
