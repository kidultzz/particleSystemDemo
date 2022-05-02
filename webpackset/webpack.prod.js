const { resolve, srcPath, theme, version } = require('./config');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const baseConfig = require('./webpack.config.base');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const HtmlMinimizerPlugin = require('html-minimizer-webpack-plugin');//HTML优化
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin; //打包后的canvas可视化分析插件


module.exports = webpackMerge(baseConfig, {
  devtool: 'source-map',
  entry: {
    main: resolve('../src/index.js'), // 主网站入口
    // common: [] // 打包公共资源
    // echarts: ["echarts", "echarts-gl"]
  },

  mode: "production",
  module: {
    rules: [
      {
        test: /\.(css|less)$/,
        include: [srcPath],
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          `less-loader?{javascriptEnabled: true, modifyVars: ${JSON.stringify(theme)}}`
        ]
      }
    ]
  },
  optimization: {
    minimize: true,
    minimizer: [new UglifyJsPlugin(), new OptimizeCSSAssetsPlugin({})],
    splitChunks: {
      chunks: "all",
      
      cacheGroups: {
        commons: {
          name: "common",
          priority: 10,
          test: /[\\/]node_modules[\\/]/,
          minChunks: 1 // 引用1次就要打包出来
        },
      }
    }
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: `css/[name].${version}.css`,
      chunkFilename: `css/[id].${version}.css"`
    }),
    new CleanWebpackPlugin({
      root: __dirname.replace("webpackset", "dist")
    }),
    new webpack.DefinePlugin({
      __DEV__: false
    }),
    new BundleAnalyzerPlugin()
  ]
});
