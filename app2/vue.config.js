module.exports = {
  // 关掉eslint
  lintOnSave: false,
  devServer: {
    open: false,
    hot: true,
    port: 8003,
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  }
}