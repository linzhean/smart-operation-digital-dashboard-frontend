const express = require('express');
const path = require('path');
const helmet = require('helmet');
const app = express();
const port = 3000;

// 使用 helmet 设置默认的安全头
app.use(helmet());

// 设置 CSP 头，允许 base64 编码的图片
app.use(helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
        'img-src': ["'self'", 'data:'],
    },
}));

// 提供静态文件
app.use(express.static(path.join(__dirname, 'src/data')));

app.get('/api/bar-chart', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/component/data', 'BarChart.html'));
});

app.get('/api/circle-chart', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/component/data', 'CircleChart.html'));
});

app.get('/api/revenue', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/component/data', 'Revenue.html'));
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
