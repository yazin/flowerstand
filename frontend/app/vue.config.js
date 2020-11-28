const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  "configureWebpack": {
    "plugins": [new HardSourceWebpackPlugin()]
  }
}
