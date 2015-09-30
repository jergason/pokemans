module.exports = {
  entry: {
    app: './js/app.js'
  },
  output: {
    path: './build',
    filename: '[name].js'
  },
  resolve: {
    extensions: ['', '.js']
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel?stage=0', exclude: [/node_modules/] }
    ]
  },
  devtool: '#eval'
}
