const path = require('path');

module.exports = {
  context: __dirname,
  entry: './frontend/pourover.jsx',
  output: {
    path: path.resolve(__dirname, 'public', 'app', 'assets'),
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['.js', '.jsx', '*']
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015']
        }
      }
    ]
  },
  devtool: 'source-map'
};
