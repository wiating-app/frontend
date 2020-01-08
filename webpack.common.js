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
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader',
        ],
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

    new ManifestPlugin({
      seed: {
        short_name: 'Wiating',
        name: 'Wiating',
        icons: [
          {
            src: '/favicon/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/favicon/android-chrome-256x256.png',
            sizes: '256x256',
            type: 'image/png',
          },
        ],
        theme_color: '#4c4c42',
        background_color: '#4c4c42',
        display: 'standalone',
      },
    }),

    new GenerateSW({
      clientsClaim: true,
      exclude: [/asset-manifest\.json$/],
    }),
  ],
}
