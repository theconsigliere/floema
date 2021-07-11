const path = require('path')

// copy webpack.config.build.js into this file
const { merge } = require('webpack-merge')

const config = require('./webpack.config')

module.exports = merge(config, {
  mode: 'production',

  output: {
    path: path.resolve(__dirname, 'public')
  }
})
