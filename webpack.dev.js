const merge = require('webpack-merge')
const Dotenv = require('dotenv-webpack')
const common = require('./webpack.common.js')

module.exports = merge(common, {
  mode: 'development',

  devServer: {
    port: 3000,
  },

  plugins: [
    new Dotenv({ path: './.env.development' }),
  ],
})
