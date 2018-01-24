'use strict'
const path = require('path')
module.exports = {
  dev: {
    host: 'localhost',
    port: 8888,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      '/ms/': {                           //这里是我配置的名字
        target: 'http://10.0.5.73:9999', //这个路径是我代理到本地tp框架里面
        changeOrigin: true,    //开启代理
        pathRewrite: {
          '^/ms': '/ms'//这里重写路径/run就代理到对应地址
        }
      }
    },
    autoOpenBrowser: true,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false,
    devtool: 'cheap-module-eval-source-map',
    cacheBusting: true,
    cssSourceMap: true
  },
  build: {
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    productionSourceMap: true,
    devtool: '#source-map',
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
