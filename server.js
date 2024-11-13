const express = require('express');
const path = require('path');
const helmet = require('helmet');
const app = express();
const port = 3000;

// Use helmet to set security headers
app.use(helmet());

// Serve API routes first
app.get('/api/bar-chart', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/component/data', 'BarChart.html'));
});

app.get('/api/circle-chart', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/component/data', 'CircleChart.html'));
});

app.get('/api/revenue', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/component/data', 'Revenue.html'));
});

// Serve static files from React app
app.use(express.static(path.join(__dirname, 'build')));

// Catch-all route to serve `index.html` for React Router
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
