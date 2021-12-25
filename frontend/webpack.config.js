/* eslint-disable strict */

'use strict';

const { resolve, join } = require('path');
const webpack = require('webpack');
const { InjectManifest } = require('workbox-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');

const pkg = require('./package.json');

module.exports = (env, options) => {
  const ENV = options.mode;
  const IS_DEV_SERVER = process.env.WEBPACK_DEV_SERVER;
  const OUTPUT_PATH = IS_DEV_SERVER ? resolve('src') : resolve('dist');

  const processEnv = {
    NODE_ENV: JSON.stringify(ENV),
    appVersion: JSON.stringify(pkg.version),
  };

  /**
   * === Copy static files configuration
   */
  const copyStatics = {
    copyWebcomponents: [{
      from: resolve('./node_modules/@webcomponents/webcomponentsjs/webcomponents-loader.js'),
      to: join(OUTPUT_PATH, 'vendor', '[name].[ext]'),
    }, {
      from: resolve('./node_modules/@webcomponents/webcomponentsjs/webcomponents-bundle.js'),
      to: join(OUTPUT_PATH, 'vendor', '[name].[ext]'),
    }, {
      from: resolve('./node_modules/@webcomponents/webcomponentsjs/bundles/webcomponents-ce.js'),
      to: join(OUTPUT_PATH, 'vendor', 'bundles', '[name].[ext]'),
    }, {
      from: resolve('./node_modules/@webcomponents/webcomponentsjs/bundles/webcomponents-sd-ce.js'),
      to: join(OUTPUT_PATH, 'vendor', 'bundles', '[name].[ext]'),
    }, {
      from: resolve('./node_modules/@webcomponents/webcomponentsjs/bundles/webcomponents-sd-ce-pf.js'),
      to: join(OUTPUT_PATH, 'vendor', 'bundles', '[name].[ext]'),
    }, {
      from: resolve('./node_modules/@webcomponents/webcomponentsjs/bundles/webcomponents-sd.js'),
      to: join(OUTPUT_PATH, 'vendor', 'bundles', '[name].[ext]'),
    }, {
      from: resolve('./node_modules/web-animations-js/web-animations-next.min.js'),
      to: join(OUTPUT_PATH, 'vendor', '[name].[ext]'),
    }],
    copyOthers: [{
      from: 'images/**',
      context: resolve('.'),
      to: OUTPUT_PATH,
    }, {
      from: resolve('./src/manifest.json'),
      to: OUTPUT_PATH,
    }, {
      from: resolve('./src/robots.txt'),
      to: OUTPUT_PATH,
    }],
  };

  /**
   * Plugin configuration
   */
  const renderHtmlPlugins = () => [
    new HtmlWebpackPlugin({
      filename: resolve(OUTPUT_PATH, 'index.html'),
      template: resolve('./src/index.html'),
      minify: ENV === 'production' && {
        collapseWhitespace: true,
        removeScriptTypeAttributes: true,
        removeRedundantAttributes: true,
        removeStyleLinkTypeAttributes: true,
        removeComments: true,
      },
      inject: true,
      compile: true,
    }),
    new HtmlWebpackTagsPlugin({
      tags: [
        './vendor/webcomponents-loader.js',
        './vendor/web-animations-next.min.js',
      ],
      append: true,
    }),
  ];

  const sharedPlugins = [
    new webpack.DefinePlugin({ 'process.env': processEnv }),
    ...renderHtmlPlugins(),
  ];

  const devPlugins = [
    new CopyWebpackPlugin({ patterns: copyStatics.copyWebcomponents }),
  ];

  const buildPlugins = [
    new CopyWebpackPlugin({
      patterns: [].concat(copyStatics.copyWebcomponents, copyStatics.copyOthers),
    }),
    new InjectManifest({
      swSrc: './src/sw.js',
      swDest: join(OUTPUT_PATH, 'service-worker.js'),
      exclude: [
        /\.map$/,
        /manifest$/,
        /\.htaccess$/,
        /service-worker\.js$/,
        /sw\.js$/,
      ],
    }),
    new CleanWebpackPlugin(),
  ];

  const plugins = sharedPlugins.concat(IS_DEV_SERVER ? devPlugins : buildPlugins);

  return {
    mode: ENV,
    entry: './src/index.js',
    output: {
      path: OUTPUT_PATH,
      filename: '[name].[fullhash].bundle.js',
    },
    devtool: 'source-map',
    module: {
      rules: [
        { test: /\.html$/, use: ['html-loader'] },
        {
          test: /\.js$/,
          // We need to transpile Polymer itself and other ES6 code
          // exclude: /(node_modules)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [[
                '@babel/preset-env',
                {
                  targets: {
                    esmodules: true,
                  },
                  debug: true,
                },
              ]],
              plugins: ['@babel/plugin-syntax-dynamic-import', '@babel/plugin-syntax-object-rest-spread'],
            },
          },
        },
      ],
    },
    plugins,
    devServer: {
      static: [
        { directory: OUTPUT_PATH },
        { directory: resolve('images') },
        { directory: resolve('dist') },
      ],
      client: {
        overlay: {
          errors: true,
          warnings: false,
        },
      },
      historyApiFallback: true,
      compress: true,
      port: 8081,
      host: '0.0.0.0',
      proxy: {
        '/api': {
          target: 'http://localhost:3000/',
          pathRewrite: { '^/api': '' },
        },
        '/auth': {
          target: 'http://localhost:3000/',
          pathRewrite: { '^/api': '' },
        },
        '/omniauth': {
          target: 'http://localhost:3000/',
          pathRewrite: { '^/api': '' },
        },
        '/public': {
          target: 'http://localhost:3000/',
          pathRewrite: { '^/public': '' },
        },

      },
    },
  };
};
