module.exports = {
  devServer: {
    open: false,
    hot: true,
    port: 8002,
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  }
}