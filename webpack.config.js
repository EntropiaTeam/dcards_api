const nodeExternals = require('webpack-node-externals');
const path = require('path');
const webpack = require('webpack');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = function(options) {
  return {
    ...options,
    mode: 'production',
    entry: './src/main.ts',
    optimization: {
      minimize: false,
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'main.js',
    },
    externals: [
      nodeExternals(),
    ],
    devtool: "inline-cheap-module-source-map",
    plugins: [
      ...options.plugins,
      new CopyPlugin({
        patterns: [
          { from: path.resolve(__dirname, "web.config"), to: path.resolve(__dirname, "dist") },
          { from: path.resolve(__dirname, "assets"), to: path.resolve(__dirname, "dist/assets") },
          { from: path.resolve(__dirname, "node_modules"), to: path.resolve(__dirname, "dist/node_modules") },
        ],
      }),
      new webpack.IgnorePlugin({
        /**
         * There is a small problem with Nest's idea of lazy require() calls,
         * Webpack tries to load these lazy imports that you may not be using,
         * so we must explicitly handle the issue.
         * Refer to: https://github.com/nestjs/nest/issues/1706
         */
        checkResource(resource) {
          const lazyImports = [
            '@nestjs/microservices',
            'cache-manager',
            'class-transformer',
          ];
          if (!lazyImports.includes(resource)) {
            return false;
          }
          try {
            require.resolve(resource);
          } catch (err) {
            return true;
          }
          return false;
        },
      }),
    ],
  };
};
