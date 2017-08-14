const path = require('path');

module.exports = {
  context: __dirname,
  entry: './frontend/pourover.jsx',
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['.js', '.jsx', '*', ".json"]
  },
  node: {
    fs: 'empty',
    net: 'empty',
    module: 'empty'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        query: {
          plugins: ["transform-regenerator"],
          presets: ['react', 'es2015']
        }
      }
    ]
  },
  devtool: 'source-map'
};
