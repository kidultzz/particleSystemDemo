const { distPath, resolve, srcPath, assetsPath, version } = require('./config');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// webpack 配置文档
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');

module.exports = {
  output: {
    publicPath: "/",
    path: distPath,
    filename: `js/[name].${version}.js`
  },
  resolve: {
    extensions: [".ts", ".js", ".tsx", ".jsx", ".json", ".css", ".less"],
    alias: {}
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        include: [srcPath],
        use: ['babel-loader']
      },
      {
        test: /\.(woff|woff2|eot|ttf|svg)$/,
        include: [assetsPath],
        use: [
          {
            loader: "file-loader",
            options: {
              limit: 10,
              name: '[name].[ext]',
              outputPath: 'fonts/'
            }
          }
        ]
      },
      {
        // 图片加载处理
        test: /\.(png|jpg|jpeg|gif|ico|svg)$/,
        include: [assetsPath],
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 4096,
              name: '[name].[ext]',
              outputPath: 'images/'
            }
          },
          {
            loader: 'image-webpack-loader',// 压缩图片
            options: {
              bypassOnDebug: true,
              disable: true
            }
          }
        ]
      },
      {
        //三维模型加载处理
        test: /\.(gltf|glb|fbx|obj)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 4096,
              name: '[name].[ext]',
              outputPath: 'models/'
            }
          }
        ]
      },
      {
        test: /\.html$/,
        loader: 'html-loader?minimize=false'
      }
    ]
  },
  plugins: [
    new CaseSensitivePathsPlugin(),

    new CopyWebpackPlugin([
      // {//打包时保留map Json
      //   from: resolve('../assets/map'),
      //   to: resolve('../dist/assets/map'),
      //   toType: 'dir'
      // }, {//保留plugin
      //   from: resolve('../assets/plugin'),
      //   to: resolve('../dist/assets/plugin'),
      //   toType: 'dir'
      // }, {//三维字体json
      //   from: resolve('../assets/fonts/YouYuan_Regular.json'),
      //   to: resolve('../dist/assets/fonts/YouYuan_Regular.json'),
      //   toType: 'dir'

      // },
      {
        from: resolve("../assets/"),
        to: resolve("../dist/assets"),
        toType: "dir"
      }
    ]),
    new HtmlWebpackPlugin({
      hash: false,
      template: resolve('../public/index.html'),
      filename: 'index.html'
    }),
  ]
};
