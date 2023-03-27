const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const { InjectManifest } = require('workbox-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const Dotenv = require('dotenv-webpack')
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')


module.exports = {
  entry: './src/index.js',

  output: {
    path: path.join(__dirname, '/build'),
    filename: 'main.js',
    publicPath: '/',
  },

  resolve: {
    fallback: {
      // Buffer required by data-uri-to-buffer has been removed from Webpack 5.
      //  Here is a polyfill.
      buffer: require.resolve('buffer/'),
    },
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
            ignore: ['**/index.html', '**/manifest.json'],
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

    new FaviconsWebpackPlugin({
      logo: './public/favicon.png',
      prefix: 'assets/',
      mode: 'webapp',
      manifest: './public/manifest.json',
      inject: true,
      favicons: {
        appName: 'Wiating',
        background: '#4c4c42',
        theme_color: '#4c4c42',
      },
    }),

    new Dotenv({
      path: './.env',
      systemvars: true,
    }),

    // This is also required for Buffer polyfil.
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    }),
  ],
}
