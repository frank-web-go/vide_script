module.exports = {
  publicPath: "./", // ./相对路径
  productionSourceMap: false, // 打包时不生成.map文件
  lintOnSave: false,
  // 这里写你调用接口的基础路径，来解决跨域
  devServer: {
    open: true,
    proxy: {
      "/dev-api": {
        target: "http://43.154.114.44:8118/",
        changeOrigin: true,
        pathRewrite: { "^/dev-api": "" },
      }
    },
    /*host: '0.0.0.0',
    port: 8118,
    client: {
      webSocketURL: 'ws://137.83.0.94:8118/websocket/session',
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
    }*/
  },
};
