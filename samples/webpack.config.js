const path = require('path');
const webpack = require('webpack');

module.exports = {
    devtool: 'source-map',
    entry: './index.js',
    output: {
        path: path.resolve(__dirname, './public'),
        filename: 'app.js',
    },
    module: {
        loaders: [
            {
                test: /\.json$/,
                loader: 'json-loader',
            },
            {
                exclude: path.resolve(__dirname, './node_modules'),
                test: /\.(js|jsx)$/,
                loader: 'babel-loader',
            },

            {
                test: /\.css$/,
                loader: 'style-loader!css-loader',
            },
            {
                test: /\.scss$/,
                loaders: ['style-loader', 'css-loader', 'sass-loader'],
            },
        ],
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                APP_ENV: JSON.stringify('development'),
            },
        }),
    ],
    resolve: {
        extensions: ['.js', '.json', '.jsx'],
        alias: {
            log: path.resolve(__dirname, '../src/utils/log.js'),
        },
    },
    devServer: {
        contentBase: './public',
        historyApiFallback: true,
        inline: true,
        port: 8080,
    },
};
