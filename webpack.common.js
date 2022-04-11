const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const { InjectManifest } = require('workbox-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
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
        include: [
          path.resolve('src'),
          path.resolve('node_modules', '@react-leaflet'),
          path.resolve('node_modules', 'react-leaflet'),
        ],
        // exclude: /node_modules\/(?!(@react-leaflet|react-leaflet)\/)/i,
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
    new CleanWebpackPlugin(),

    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),

    new CopyPlugin({
      patterns: [
        {
          from: '**/*',
          to: './',
          context: './public/',
          globOptions: {
            ignore: ['**/index.html'],
          },
        },
      ],
    }),

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
