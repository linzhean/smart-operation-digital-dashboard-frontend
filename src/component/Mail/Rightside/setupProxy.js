const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/webSocket',
    createProxyMiddleware({
      target: 'https://smart-digital-dashboard.ntubimdbric.tw/backend',
      changeOrigin: true,
      ws: true, // 為 WebSocket 啟用代理
      secure: false,
    })
  );
};
