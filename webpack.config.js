const CleanWebpackPlugin = require('clean-webpack-plugin')
module.exports = {
  mode: 'development',
  entry: {
    index: './src/index.js',
    vendor: ['downloadjs']
  },
  output: {
    filename: '[name].js',
    path: __dirname + '/dist'
  },
  plugins: [
    new CleanWebpackPlugin(['dist'], {
      verbose: false
    })
  ]
}
