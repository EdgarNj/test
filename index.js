// Встроенный http — никаких зависимостей
const http = require('http');

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end('privet edgar');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`API слушает на http://localhost:${PORT}`);
});
