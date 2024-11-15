const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/webSocket',
    createProxyMiddleware({
      target: 'https://smart-digital-dashboard.ntubimdbirc.tw/backend',
      changeOrigin: true,
      ws: true, 
      secure: false,
    })
  );
};
