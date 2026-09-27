const webpack = require('webpack');
const dotenv = require('dotenv');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        index: path.resolve(__dirname, 'src/index.js'),
      },
    mode: "development",
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'build.js',
        publicPath: 'auto'
    },
    resolve: {
        extensions: ['.js', '.jsx', '.css'],
        alias: {
            '@': path.resolve(__dirname, 'src/'),
        }
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: 'html-loader'
                    }
                ]
            },
            {
                test: /\.css$/,
                use: [
                "style-loader",
                { loader: "css-loader", options: { importLoaders: 1 } },
                "postcss-loader",
                ],
            },
            {
                test: /\.(png|gif|jpg)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'assets/[hash][ext][query]',
                },
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'fonts/[name][ext][query]',
                },
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html',
            filename: './index.html',
            favicon: './public/favicon.svg'
        }),
        new webpack.DefinePlugin(
            Object.keys({ ...(dotenv.config().parsed || {}), ...process.env })
                .filter(key => key.startsWith('REACT_APP_'))
                .reduce((env, key) => {
                    env[`process.env.${key}`] = JSON.stringify(
                        (dotenv.config().parsed || {})[key] ?? process.env[key]
                    );
                    return env;
                }, {
                    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
                })
        ),
        //  "transform-decorators-legacy"
    ],
    devServer: {
        historyApiFallback: true,
        port: process.env.PORT || 3000,
        open: true
    },
}
