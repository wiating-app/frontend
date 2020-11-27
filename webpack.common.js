const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { InjectManifest } = require('workbox-webpack-plugin')
const WebpackCleanupPlugin = require('webpack-cleanup-plugin')
const Dotenv = require('dotenv-webpack')


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
        include: path.join(__dirname, 'src'),
        use: 'babel-loader',
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
                require('cssnano'),
              ],
            },
          },
        ],
      },

      {
        test: /\.(png|jpg|gif)$/,
        use: [
          'file-loader',
        ],
      },

      {
        test: /\.svg$/,
        loader: 'svg-inline-loader',
      },

    ],
  },

  plugins: [
    new WebpackCleanupPlugin(),

    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),

    new CopyWebpackPlugin([
      {
        from: '**/*',
        to: './',
        context: './public/',
        ignore: ['index.html'],
      },
    ]),

    new InjectManifest({
      swSrc: './src/serviceWorker.js',
      swDest: 'service-worker.js',
      exclude: [
        /_redirects$/,
      ],
    }),


    new Dotenv({
      path: './.env',
      systemvars: true,
    }),
  ],
}
