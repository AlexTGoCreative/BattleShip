import { merge } from 'webpack-merge';
import webpackCommon from './webpack.common.js';
import path from 'path';

export default merge(webpackCommon, {
  mode: 'production',
  devtool: 'source-map',
  
  output: {
    filename: '[name].[contenthash].js',
    chunkFilename: '[name].[contenthash].chunk.js',
    path: path.resolve(process.cwd(), 'dist'),
    clean: true,
    publicPath: '/'
  },

  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
        common: {
          name: 'common',
          minChunks: 2,
          chunks: 'all',
          enforce: true,
        },
      },
    },
    runtimeChunk: 'single',
    moduleIds: 'deterministic',
  },

  performance: {
    hints: 'warning',
    maxAssetSize: 512000,
    maxEntrypointSize: 512000,
  },
});
