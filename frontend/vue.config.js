module.exports = {
  "devServer": {
    "proxy": {
      "/api": {
        "target": "http://localhost:3000/api",
        "changeOrigin": true,
        "pathRewrite": {
          "^/api": ""
        }
      }
    }
  },
  "outputDir": "../apm_backend/public",
  "transpileDependencies": [
    "vuetify"
  ]
}