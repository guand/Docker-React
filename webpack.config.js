const React = require('react');
const render = require('react-dom').render;
const path = require('path');
const webpack = require('webpack');
const precss = require('precss');
const postcssCssnext = require('postcss-cssnext');
const postcssUrl = require('postcss-url');
const postcssNestedVars = require('postcss-nested-vars');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const packageVersion = require("./package.json").version

const plugins = {
  uglifyJs: new webpack.optimize.UglifyJsPlugin({
    compressor: {
      screw_ie8: true,
      warnings: false,
    },
    compress: {
      warnings: true,
    },
    sourceMap: process.env['NODE_ENV'] == 'DEVELOPMENT' ? true : false,
    output: {
      comments: false
    }
  }),
  optimizeCss: new OptimizeCssAssetsPlugin({
    cssProcessor: require('cssnano'),
    cssProcessorOptions: { discardComments: {removeAll: true } },
    canPrint: true
  }),
  define: new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: process.env.NODE_ENV === "" ? JSON.stringify("production") : JSON.stringify(process.env.NODE_ENV),
      STRIPE_ENV: process.env.STRIPE_ENV === "" ? JSON.stringify("test") : JSON.stringify(process.env.STRIPE_ENV),
      HOME: JSON.stringify(process.env.HOME),
      REDUX: JSON.stringify(process.env.REDUX)
    }
  }),
  fetch:  new webpack.ProvidePlugin({'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'}),
  occurenceOrder: new webpack.optimize.OccurrenceOrderPlugin(),
};

var routeComponentRegex = /applications\/([^\/]+\/?[^\/]+).js$/;

module.exports = function(env) {
  const version = env ? (env.version || packageVersion) : packageVersion
  const extractCSS = new ExtractTextPlugin(version + '/css/main.css');
  return {
    entry: [
      path.resolve(__dirname, 'src', 'index.js'),
    ],
    output: {
      path: path.resolve(__dirname, 'public', 'build'),
      publicPath: '/',
      filename: version + '/js/[name].js',
    },
    devtool: 'source-map',
    devServer: {
      historyApiFallback: {
        index:'/index.html',
      },
      disableHostCheck: true,
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: [/node_modules/],
          use: [
            {
                loader: 'babel-loader',
                options: {
                  cacheDirectory: true,
                  presets: ['react', 'es2015', 'stage-0'],
                  plugins: ['react-html-attrs', 'transform-class-properties', 'transform-decorators-legacy']
                }
            }
          ]
        },
        {
          test:   /\.json$/,
          use: ['json-loader']
        },
        {
            test: /\.css?$/,
            use: extractCSS.extract([ 'css-loader', 'postcss-loader' ])
        },
        {
          test: /\.html$/,
          use: ['file-loader?name=[name].[ext]']
        },
        {
          test: /\.(png|jpg|gif|svg|woff|ttf|otf|eot)$/,
          use: ['url-loader?limit=8192']
        },
        {
          test: /\.csv$/,
          use: [
            {
              loader: 'csv-loader',
              options: {
                dynamicTyping: true,
                header: true,
                skipEmptyLines: true
              }
            }
          ]
        }
      ]
    },
    resolve: {
      modules: [
        path.resolve('./src/modules'),
        'node_modules', 'bower_components', 'src'
      ],
      enforceExtension: false,
      extensions: ['.js', '.jsx', '.json', '.css', '.html'],
    },
    plugins: [
      plugins.uglifyJs,
      plugins.define,
      plugins.fetch,
      plugins.occurenceOrder,
      new webpack.LoaderOptionsPlugin({
        minimize: process.env['NODE_ENV'] == 'DEVELOPMENT'? false: true,
        debug: true,
        options: {
          postcss: function (webpack) {
            return [
              precss,
              postcssCssnext(),
              postcssUrl(),
              postcssNestedVars(),
            ]
          },
        }
      }),
      extractCSS,
      plugins.optimizeCss,
      new HtmlWebpackPlugin({
        template: 'src/index.ejs',
        chunks: ['main']
      }),
    ].slice(process.env['NODE_ENV'] === 'DEVELOPMENT'? 1 : 0)
  }
}