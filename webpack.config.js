'use strict';
const path = require('path');
const webpack = require('webpack');
const HtmlPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: {
        app: './client/index.js',
        vendor: [
            'angular-material',
            'angular-material/angular-material.css',
            'ng-draggable',
            'ng-draggable/ng-draggable.js'
        ]
    },
    output: {
        filename: 'build.js',
        path: path.resolve(__dirname, 'build')
    },
    devtool: false,
    module: {
        rules: [
            {
                test: /\.(js)$/,
                exclude: /(node_modules)/,
                use: ['ng-annotate-loader', 'babel-loader']
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract('css-loader')
            },
            {
                test: /\.(eot|woff|ttf|svg|png|jpg)$/,
                loader: 'url-loader?limit=30000&name=[path][name]-[hash].[ext]'
            }

        ]
    },
    plugins: [
        // new webpack.NoEmitOnErrorsPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: 'vendors.js'
        }),
        new webpack.optimize.UglifyJsPlugin({sourceMap:true}),
        new HtmlPlugin({
            template: 'index.html',
            filename: 'index.html'
        }),
        new ExtractTextPlugin('style.css')
    ]
};