const CleanWebpackPlugin = require('clean-webpack-plugin')
const nodeExternals = require('webpack-node-externals') //解绑模块
const path = require('path')
module.exports = {
  mode: 'production',
  entry: {
    index: './src/index.js'
  },
  output: {
    filename: 'index.js',
    path: __dirname + '/lib',
    library: 'customJson2excel',
    libraryTarget: 'commonjs2'
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  externals: [
    // ...Object.keys(packageJson.dependencies),
    nodeExternals({
      modulesFromFile: true
    })
  ],
  module: {
    rules: [
      {
        test: /\.js?$/,
        loader: 'babel-loader',
        include: [path.resolve(__dirname, './src')]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['lib'], {
      verbose: false
    })
  ],
  devtool: 'source-map'
}
