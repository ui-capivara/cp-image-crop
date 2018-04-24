const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');
const merge = require('webpack-merge');
const webpackCommon = require('./webpack.common');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = merge(webpackCommon, {
    mode: 'production',
    output: {
        path: path.join(__dirname, '../dist/'),
        filename: 'cp-image-crop.min.js',
        publicPath: '/dist/'
    },
    plugins: [
        new UglifyJSPlugin(),
        new ExtractTextPlugin({
            filename: "cp-image-crop.min.css",
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
                                minimize: true 
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
                                minimize: true 
                            }
                        }, 
                        {
                            loader: "sass-loader",
                            options: { 
                                minimize: true 
                            }
                        }
                    ],
                    fallback: "style-loader"
                })
            }
        ]
    }
});