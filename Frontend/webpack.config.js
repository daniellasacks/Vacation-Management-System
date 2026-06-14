const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

const isProduction = process.env.NODE_ENV === 'production';
const apiBaseUrl = process.env.API_BASE_URL || (isProduction ? '/api' : 'http://localhost:3001/api');
const assetsBaseUrl = process.env.ASSETS_BASE_URL || (isProduction ? '' : 'http://localhost:3001');

module.exports = {
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: process.env.PUBLIC_PATH || '/',
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    new webpack.DefinePlugin({
      'process.env.API_BASE_URL': JSON.stringify(apiBaseUrl),
      'process.env.ASSETS_BASE_URL': JSON.stringify(assetsBaseUrl),
      'process.env.DEMO_MODE': JSON.stringify(process.env.DEMO_MODE === 'true'),
      'process.env.PUBLIC_PATH': JSON.stringify(process.env.PUBLIC_PATH || '/'),
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    compress: true,
    port: 3000,
    historyApiFallback: true,
  },
};
