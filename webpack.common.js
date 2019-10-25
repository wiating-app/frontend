const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ManifestPlugin = require('webpack-manifest-plugin')
const { GenerateSW } = require('workbox-webpack-plugin')
const WebpackCleanupPlugin = require('webpack-cleanup-plugin')


module.exports = {
  entry: './src/index.js',

  output: {
    path: path.join(__dirname, '/build'),
    filename: 'main.js',
    publicPath: '/',
  },

  module: {
    rules: [

      {
        test: /\.(js|jsx)$/,
        include: path.join(__dirname, '/src'),
        use: ['babel-loader'],
      },

      {
        test: /\.s[ac]ss|css$/i,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: [
                require('autoprefixer'),
                require('cssnano')
              ],
            },
          },
        ],
      },

    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),

    new CopyWebpackPlugin([
      {
        from: '**/*.*',
        to: './',
        context: './public/',
        ignore: ['index.html'],
      },
    ]),

    new ManifestPlugin({
      fileName: 'asset-manifest.json',
    }),

    new GenerateSW({
      clientsClaim: true,
      exclude: [/asset-manifest\.json$/],
    }),

    new WebpackCleanupPlugin(),

  ],
}
