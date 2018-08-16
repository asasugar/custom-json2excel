const CleanWebpackPlugin = require('clean-webpack-plugin')
const path=require('path')
module.exports = {
  mode: 'development',
  entry: {
    index: './src/index.js',
  },
  output: {
    filename: '[name].js',
    path: __dirname + '/dist',
    library: 'test',
    libraryTarget: 'commonjs2'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        include: [path.resolve(__dirname, './src')],
      },
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['dist'], {
      verbose: false
    })
  ]
}
