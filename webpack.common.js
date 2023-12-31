'use strict';

const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TSConfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

const SOURCE_ROOT = __dirname + '/src/main/webpack';

const resolve = {
  extensions: ['.js', '.ts', '.json', '.jsx', '.tsx'],
  plugins: [
    new TSConfigPathsPlugin({
      configFile: './tsconfig.json',
    }),
  ],
};

module.exports = {
  resolve: resolve,
  entry: {
    site: SOURCE_ROOT + '/site/main.ts',
    ota: SOURCE_ROOT + '/react-project/src/index.js',
  },
  output: {
    filename: (chunkData) => {
      return chunkData.chunk.name === 'ota' ? 'clientlib-ota/[name].js' : 'clientlib-site/[name].js';
    },
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
          },
          {
            loader: 'glob-import-loader',
            options: {
              resolve: resolve,
            },
          },
        ],
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.css?$/,
        use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
      },
      {
        test: /\.scss$/,
        use: [{ loader: 'style-loader' }, { loader: 'css-loader' }, { loader: 'sass-loader' }],
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              url: false,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins() {
                return [require('autoprefixer')];
              },
            },
          },
          {
            loader: 'sass-loader',
          },
          {
            loader: 'glob-import-loader',
            options: {
              resolve: resolve,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new ESLintPlugin({
      extensions: ['js', 'ts', 'tsx'],
    }),
    new MiniCssExtractPlugin({
      filename: 'clientlib-[name]/[name].css',
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: path.resolve(__dirname, SOURCE_ROOT + '/resources'), to: './clientlib-site/' }],
    }),
  ],
  stats: {
    assetsSort: 'chunks',
    builtAt: true,
    children: false,
    chunkGroups: true,
    chunkOrigins: true,
    colors: false,
    errors: true,
    errorDetails: true,
    env: true,
    modules: false,
    performance: true,
    providedExports: false,
    source: false,
    warnings: true,
  },
};
