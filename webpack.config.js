const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
//import "./client/css/application.css";

module.exports = {
    // where to start transpiling
    entry: './client/index.js',
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json', '.css', '.scss'],
        modules: ['src', 'node_modules'] // Assuming that your files are inside the src dir
    },
    mode: process.env.NODE_ENV,
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js',
    },
    devServer: {
        // where build is being served from
        static: {
            directory: path.join(__dirname, 'client')
        },
        // servers requests to /api port 8080 to port 3000
        proxy: {
            '/api/**': 'http://localhost:3000/',
        }
    },
    // how to transpile code
    module: {
        rules: [
        {   // checks for js and jsx files
            test: /\.jsx?/,
            // exclude node modules
            exclude: [/node_modules/],
            // specifies what loaders to use for transpiling
            use: 
            {
            loader: 'babel-loader',
            options: 
                { // encode ECMA script code and React code
                presets: [['@babel/preset-env'], ['@babel/preset-react']]
                }
            }   
        },
        {
            test: /.(css|scss)$/,
            exclude: /node_modules/,
            use: ['style-loader', 'css-loader','sass-loader']
        }
    ]
 },
 plugins: [
    new HtmlWebpackPlugin({
    inject: 'body',
    template: './index.html',
    filename: 'index.html'
 }), // use MiniCssExtractPlugin used to increase download speed of css and creates a separate css file to bundle.js in browser
],
}
