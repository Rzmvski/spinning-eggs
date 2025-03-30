import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { WebpackConfiguration } from 'webpack-cli';
import { DefinePlugin } from 'webpack';
import * as process from 'process';

const src = path.resolve(__dirname, 'src');
const dist = path.resolve(__dirname, 'dist');

const webpackConfig: WebpackConfiguration = {
  entry: './index.tsx',
  output: {
    path: dist,
    filename: 'js/[name].js',
    chunkFilename: 'js/[name].js'
  },
  context: src,
  devtool: 'source-map',
  module: {
    rules: [
      {
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        test: /\.[tj]sx?$/,
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          'css-loader',
          'less-loader',
        ],
      },
    ],
  },
  resolve: {
    modules: [src, 'node_modules'],
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    alias: {
      src,
    },
  },
  plugins: [
    new DefinePlugin({
      'process.env.OPENROUTER_API_KEY': JSON.stringify(process.env.OPENROUTER_API_KEY)
    }),
    new HtmlWebpackPlugin({
      template: './index.html',
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
      chunkFilename: 'css/[name].css',
    }),
  ],
};

export default webpackConfig;
