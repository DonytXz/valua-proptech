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
        new webpack.DefinePlugin({
            'process.env': JSON.stringify(
                Object.keys({ ...(dotenv.config().parsed || {}), ...process.env })
                    .filter(key => key.startsWith('REACT_APP_'))
                    .reduce((acc, key) => {
                        acc[key] = (dotenv.config().parsed || {})[key] ?? process.env[key];
                        return acc;
                    }, {
                        NODE_ENV: process.env.NODE_ENV || 'production',
                        REACT_APP_VALUA_API_URL: process.env.REACT_APP_VALUA_API_URL || (dotenv.config().parsed || {}).REACT_APP_VALUA_API_URL || 'https://valua-api.onrender.com/api/v1',
                        REACT_APP_FIREBASE_API_KEY: process.env.REACT_APP_FIREBASE_API_KEY || (dotenv.config().parsed || {}).REACT_APP_FIREBASE_API_KEY || '',
                        REACT_APP_FIREBASE_AUTH_DOMAIN: 'property-valuator.firebaseapp.com',
                        REACT_APP_FIREBASE_PROJECT_ID: 'property-valuator',
                        REACT_APP_FIREBASE_STORAGE_BUCKET: 'property-valuator.appspot.com',
                        REACT_APP_FIREBASE_MESSAGING_SENDER_ID: '360449449280',
                        REACT_APP_FIREBASE_APP_ID: '1:360449449280:web:a64721a1197e9a592d2ea5',
                    })
            )
        }),
        //  "transform-decorators-legacy"
    ],
    devServer: {
        historyApiFallback: true,
        port: process.env.PORT || 3000,
        open: true
    },
}
