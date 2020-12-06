const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  "configureWebpack": {
    "plugins": process.env.NODE_ENV === 'development' ? [new HardSourceWebpackPlugin()] : []
  },
  "productionSourceMap": false,
  "optimization": {
    "splitChunks": {
      "cacheGroups": {
        "commons": {
          "test": "/[\\/]node_modules[\\/]/",
          "name": "vendor",
          "chunks": "all"
        }
      }
    }
  }
}
