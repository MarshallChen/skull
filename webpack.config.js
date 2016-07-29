var webpack = require('webpack');
var path = require("path");
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var pkg = require('./package.json');
var p = process.env.NODE_ENV === 'production' ? true : false;

module.exports = {
  context: path.join(__dirname, ''),
  entry: {
    app: p ? './index.js' : [
      'webpack-dev-server/client?http://0.0.0.0:8080',
      'webpack/hot/only-dev-server',
      './index.js'
    ]
  },
  output: {
    path: path.join(__dirname, 'assets/'),
    publicPath: p ? '/assets/' : '/',
    filename: '[name].[hash].js'
  },
  module: {
    loaders: [
      { test: /\.css$/, loader: p ? ExtractTextPlugin.extract("style-loader","css-loader") : "style-loader!css-loader"},
      { test: /\.styl$/, loader: p ?
        ExtractTextPlugin.extract("style-loader", "css-loader!autoprefixer-loader?browsers=last 2 version!stylus-loader") :
        "style-loader!css-loader!autoprefixer-loader?browsers=last 2 version!stylus-loader" },
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
      {
        loaders: [
          'url-loader?limit=10000&name=[path][name].[ext]\?[hash]',
          'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
        ],
        test: /\.(gif|jpe?g|png|woff|woff2|eot|ttf|svg)$/
      },
      { test: /\.html$/, loader: 'file?name=[name].[ext]'}
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: pkg.name,
      template: 'index.ejs',
      minify: {
        removeComments: true,
        collapseWhitespace: true
      }
    }),
    new webpack.DefinePlugin({
      'process.env': {
        PUBLIC_PATH: p ? `'/assets/'` : `'/'`
      }
    }),
    new ExtractTextPlugin('app.[hash].css', {
      allChunks: true
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        // Because uglify reports so many irrelevant warnings.
        warnings: false
      }
    })
  ],
  devServer: {
    contentBase: './',
    publicPath: '/'
  }
}
