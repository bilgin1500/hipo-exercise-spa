const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackTemplate = require('html-webpack-template');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const mode = process.env.WEBPACK_MODE || 'development';
const config = require('./src/utilities/config.js');

module.exports = {
  mode: mode,
  resolve: {
    extensions: ['.js', '.json', '.jpg', '.png', '.svg'],
    alias: {
      containers: path.resolve(__dirname, 'src/containers/'),
      components: path.resolve(__dirname, 'src/components/'),
      utilities: path.resolve(__dirname, 'src/utilities'),
      images: path.resolve(__dirname, 'src/assets/images')
    }
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        loader: 'babel-loader?cacheDirectory'
      },
      {
        test: /\.(svg|ico|png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: config.webpack.output_assets_folder + '/',
              name: '[name].[ext]'
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  devServer: {
    contentBase: path.resolve(__dirname, config.webpack.output_folder),
    port: config.webpack.dev_server_port,
    historyApiFallback: { index: '/' },
    open: true,
    hot: true,
    stats: 'minimal'
  },
  // https://webpack.js.org/configuration/stats/
  stats: {
    hash: false,
    version: false,
    timings: true,
    assets: false,
    chunks: false,
    modules: false,
    reasons: false,
    children: false,
    source: false,
    errors: true,
    errorDetails: true,
    warnings: true,
    publicPath: false
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          enforce: true,
          chunks: 'all'
        }
      }
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(mode)
    }),
    new CleanWebpackPlugin(['dist'], { verbose: true }),
    new HtmlWebpackPlugin({
      template: HtmlWebpackTemplate,
      title: config.app.title,
      favicon: './src/assets/images/favicon.ico',
      links: [
        {
          href: '/assets/favicon-16x16.png',
          rel: 'icon',
          sizes: '16x16',
          type: 'image/png'
        },
        {
          href: '/assets/favicon-32x32.png',
          rel: 'icon',
          sizes: '32x32',
          type: 'image/png'
        }
      ],
      //devServer: 'http://localhost:' + config.webpack.dev_server_port,
      meta: [
        { name: 'robots', content: 'noindex,nofollow' },
        {
          name: 'description',
          content: config.app.description
        }
      ],
      mobile: true,
      appMountIds: ['app'],
      lang: 'en-US',
      inject: false,
      minify: {
        collapseWhitespace: true,
        conservativeCollapse: true,
        preserveLineBreaks: true,
        useShortDoctype: true,
        html5: true
      }
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new CopyWebpackPlugin([
      {
        from: './src/assets/fonts/**/*',
        to: config.webpack.output_assets_folder + '/fonts',
        flatten: true
      }
    ])
  ]
};
