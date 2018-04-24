const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const merge = require('webpack-merge');
const webpackCommon = require('./webpack.common');
const webpack = require('webpack');

module.exports = merge(webpackCommon, {
    mode: 'development',
    devtool: 'source-map',
    output: {
        path: path.join(__dirname, '../dist/'),
        filename: 'cp-image-scrop.js',
        publicPath: '/dist/'
    },
    devServer: {
        inline: true,
        host: '0.0.0.0',
        port: 1111
    },
    plugins: [
        new ExtractTextPlugin({
            filename: "capivara-image-scrop.css",
            allChunks: true
        })
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader', 
                            options: { 
                                minimize: false 
                            }
                        }
                    ]
                })
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    use: [
                        {
                            loader: "css-loader",
                            options: { 
                                minimize: false 
                            }
                        }, 
                        {
                            loader: "sass-loader",
                            options: { 
                                minimize: false 
                            }
                        }
                    ],
                    fallback: "style-loader"
                })
            }
        ]
    }
});