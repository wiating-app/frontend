const { merge } = require('webpack-merge')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const { WebpackBundleSizeAnalyzerPlugin } = require('webpack-bundle-size-analyzer')
const common = require('./webpack.common.js')


module.exports = merge(common, {
  mode: 'production',

  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },

  plugins: [
    new OptimizeCssAssetsPlugin(),
    new WebpackBundleSizeAnalyzerPlugin('./plain-report.txt'),
  ],
})
