/**
 * Created by sashkoboom on 25. 11. 2018.
 */
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    entry: './app/js/index.js',
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            }
        ]
    },
    resolve: {
        extensions: ['*', '.js', '.jsx']
    },
    output: {
        path: __dirname + '/dist',
        publicPath: '/',
        filename: 'bundle.js'
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            title: 'My App',
            template: "index.html",
            "assets": {
                "style"  : "app/styles/styles.css",
            }
        })
    ],
    devServer: {
        contentBase: './dist',
        hot: true
    }
};
