const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/webSocket',
    createProxyMiddleware({
      target: 'http://140.131.115.153:8080',
      changeOrigin: true,
      ws: true, 
      secure: false,
    })
  );
};
