
const path = require('path')
const webpack = require('webpack')

// copies files from one place to another
const CopyWebpackPlugin = require('copy-webpack-plugin')
// fetch css files from js files
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

// CHECK FROM NODE.JS WHICH VERSION WE ARE RUNNING
const IS_DEVELOPMENT = process.env.NODE_ENV === 'dev'

// check path of application and append to imports etc
const directPathApp = path.join(__dirname, 'app')
const directPathShared = path.join(__dirname, 'shared')
const directPathStyles = path.join(__dirname, 'styles')
const directNodeModules = 'node_modules'

// console.log(directPathApp,directPathShared,directPathStyles)

module.exports = {
  // entry point of application
  entry: [
    path.join(directPathApp, 'index.js'),
    // entry point of styles
    path.join(directPathStyles, 'index.scss')
  ],

  // resolves imports in js files, so when looking files you can just state foldername and file
  // ie  import utils from 'utils/utils.js'
  resolve: {
    modules: [
      directPathApp,
      directPathShared,
      directPathStyles,
      directNodeModules
    ]

  },

  plugins: [
    new webpack.DefinePlugin({
      IS_DEVELOPMENT
    }),
    new CleanWebpackPlugin(),
    //  new webpack.ProvidePlugin({
    // instead of importing intentionally
    // for example you could import jquery here, rather than on the js file
    //  })

    // copy shared folder into 'public' build folder
    new CopyWebpackPlugin({
      patterns: [
        {
          from: './shared',
          to: ''
        }
      ]
    }),

    // for inline styles
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css'
    }),
    new ImageMinimizerPlugin({
      minimizerOptions: {
        // Lossless optimization with custom option
        // Feel free to experiment with options for better result for you
        plugins: [
          ['gifsicle', { interlaced: true }],
          ['jpegtran', { progressive: true }],
          ['optipng', { optimizationLevel: 8 }]
        ]
      }
    })
  ],

  module: {
    rules: [
      {
        // RegExp checking the file ends in '.js'
        test: /\.js$/,
        use: {
          loader: 'babel-loader'
        }
      },

      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: ''
            }
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'postcss-loader'
          },
          {
            loader: 'sass-loader'
          }

        ]
      },

      {
        // looking for approved file types jpeg,jpg,png,gif
        test: /\.(jpe?g|png|gif|svg|woff|woff2|fnt|webp)$/,
        loader: 'file-loader',
        options: {
          name (file) {
            // this saves the asset from for example 'image.png' to 'ffg586493.png' in the build (public) folder
            return '[hash].[ext]'
          }
        }
      },

      {
        test: /\.(jpe?g|png|gif|svg|webp)$/i,
        use: [
          {
            loader: ImageMinimizerPlugin.loader

          }
        ]
      },
      {
        test: /\.(glsl|frag|vert)$/,
        loader: 'raw-loader',
        exclude: /node_modules/

      },
      {
        test: /\.(glsl|frag|vert)$/,
        loader: 'glslify-loader',
        exclude: /node_modules/

      }

    ]
  },

  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()]
  }

}
