const path = require('path')
const isDev = process.env.NODE_ENV === 'development'
const HtmlPlugin = require('html-webpack-plugin')
const htmlTemplate = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Fractal examples</title>
  </head>
  <body>
    <div id="app"></div>
  </body>
</html>
`

module.exports = {
    entry: './src/bundle.tsx',

    output: {
        path: path.resolve('./dist'),
        filename: 'bundle.js',
        publicPath: '/',
    },

    devtool: isDev ? 'inline-source-map' : 'source-map',

    mode: process.env.NODE_ENV,

    resolve: {
        modules: [path.resolve('./'), path.resolve('./source'), path.resolve('node_modules')],
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },

    resolveLoader: {
        modules: [path.resolve('node_modules')],
    },

    plugins: [
        new HtmlPlugin({
            filename: 'index.html',
            templateContent: htmlTemplate,
            inject: true,
            hash: true,
            cache: true,
        }),
    ],

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: ['babel-loader'],
                exclude: /node_modules/,
            },
            {
                test: /\.svg$/,
                use: ['@svgr/webpack'],
            },
            {
                test: /\.(mp3|ogg|jpg)$/,
                use: ['file-loader'],
                exclude: /node_modules/,
            },
        ],
    },

    devServer: {
        port: 4000,
        historyApiFallback: true,
        filename: 'app.js',
        overlay: true,
        headers: { 'Access-Control-Allow-Origin': '*' },
        stats: 'errors-only',
        hot: true,
    },
}
