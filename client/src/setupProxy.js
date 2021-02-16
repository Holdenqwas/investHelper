const { createProxyMiddleware } = require('http-proxy-middleware');


module.exports = function(app) {
    // app.use('*', createProxyMiddleware( 
    //     { target: 'http://localhost:5000/',
    //     changeOrigin: true }
    // ));
    app.use('/api/data', createProxyMiddleware( 
        { target: 'http://localhost:5000/',
        changeOrigin: true }
    ));
    app.use('/api/data/short', createProxyMiddleware( 
        { target: 'http://localhost:5000/',
        changeOrigin: true }
    ));
    app.use('/api/auth/register',  createProxyMiddleware(
        { target: 'http://localhost:5000/',
        changeOrigin: true }
    ));
    app.use('/api/auth/login',  createProxyMiddleware(
        { target: 'http://localhost:5000/',
        changeOrigin: true }
    ));
    app.use('/api/data/buy',  createProxyMiddleware(
        { target: 'http://localhost:5000/',
        changeOrigin: true }
    ));
    app.use('/api/auth/checking',  createProxyMiddleware(
        { target: 'http://localhost:5000/',
        changeOrigin: true }
    ));
}