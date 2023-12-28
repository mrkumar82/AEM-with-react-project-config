const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const SOURCE_ROOT = __dirname + '/src/main/webpack';

module.exports = (env) => {
  const writeToDisk = env && Boolean(env.writeToDisk);
  console.log('env', env, writeToDisk);
  return merge(common, {
    mode: 'development',
    performance: {
      hints: 'warning',
      maxAssetSize: 1048576,
      maxEntrypointSize: 1048576,
    },
    resolve: {
      fallback: {
        "fs": false,
        "path": false,
        "os": false
      }
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, SOURCE_ROOT + '/static/index.html'),
      }),

      new CopyWebpackPlugin({
        patterns: [
          {
            from: './src/main/webpack/components/**/*.html',
            to({ context, absoluteFilename }) {
              return 'components/[name]/[name][ext]';
            },
          },
          {
            from: './dist/clientlib-site/site.css',
            to({ context, absoluteFilename }) {
              return '../../ui.apps/src/main/content/jcr_root/apps/project-name/clientlibs/clientlib-site/css/site.css';
            },
          },
          {
            from: './dist/clientlib-site/site.js',
            to({ context, absoluteFilename }) {
              return '../../ui.apps/src/main/content/jcr_root/apps/project-name/clientlibs/clientlib-site/js/site.js';
            },
          },
        ],
      }),
    ],
    devServer: {
      proxy: [
        {
          context: ['/content', '/etc.clientlibs'],
          target: 'http://localhost:4502',
        },
      ],
      client: {
        overlay: {
          errors: true,
          warnings: false,
        },
      },
      watchFiles: ['src/**/*'],
      hot: false,
      devMiddleware: {
        writeToDisk: true,
      },
    },
  });
};
