module.exports = {
  devServer: {
    proxy: { // proxyTable 설정
        '/api': {
            target: 'http://ec2-15-165-126-152.ap-northeast-2.compute.amazonaws.com:8080',
            changeOrigin: true
        }
    },
    port: 8080
  },
  "transpileDependencies": [
    "vuetify"
  ]
}