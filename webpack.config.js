const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');


module.exports = {
  target: 'node',
  context: __dirname + "/src",
  entry: './module.ts',
  watch: true,
  devtool: 'source-map',
  output: {
    filename: "module.js",
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: "amd"
  },
  externals: [
    'jquery', 'lodash', 'moment',
    function(context, request, callback) {
      var prefix = 'grafana/';
      if (request.indexOf(prefix) === 0) {
        return callback(null, request.substr(prefix.length));
      }
      callback();
    }
  ],
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new CopyWebpackPlugin([
      { from: 'plugin.json' },
      { from: 'css/*' },
      { from: 'partials/*' },
      { from: 'assets/*/**' },
      { from: 'assets/*' },
      { from: 'screenshots/*' }
    ])
  ],
  resolve: {
    extensions: [".ts", ".js"]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loaders: [
          {
            loader: "babel-loader",
            options: { presets: ['env'] }
          },
          "ts-loader"
        ],
        exclude: /node_modules/,
      }
    ]
  }
}