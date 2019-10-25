const merge = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = merge(common, {
  mode: 'development',

  devServer: {
    port: 3000,
  },

  module: {
    rules: [
      // Enable support for loading fronthack-scripts.
      {
        test: /\.exec\.js$/,
        use: ['script-loader'],
      },
    ],
  },
})
