const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const GasPlugin = require('gas-webpack-plugin');
const es3ifyPlugin = require('es3ify-webpack-plugin');
const { version } = require('./package.json');

const destination = 'dist';
// Note: As recommended in https://github.com/fossamagna/gas-webpack-plugin/issues/135#issuecomment-396093757
const mode = 'none';

module.exports = {
  devtool: 'inline-source-map',
  entry: './src/index.ts',
  mode,
  output: {
    filename: `code-${version}.js`,
    path: path.resolve(__dirname, destination),
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      { test: /\.ts?$/, loader: 'ts-loader' },
    ],
  },
  plugins: [
    new CleanWebpackPlugin([destination]),
    new CopyWebpackPlugin([
      {
        from: './appsscript.json',
        to: path.resolve(__dirname, destination)
      }
    ]),
    new GasPlugin(),
    new es3ifyPlugin(),
  ],
};
