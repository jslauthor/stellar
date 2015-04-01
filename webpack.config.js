//var UglifyJsPlugin = require("webpack/lib/optimize/UglifyJsPlugin");

module.exports = {
    target: "node-webkit",
    debug: true,
    devtool: "source-map",
    entry: {
        main: "./src/js/index.js"
    },
    output: {
        path: "./js",
        filename: "bundle.js"
    },
    resolve: {
        modulesDirectories: ['bower_components', 'node_modules'],
        extensions: ['', '.js', '.json']
    },
    module: {
        loaders: [
            { test: /\.css/, loader: "style-loader!css-loader" },
            { test: /\.scss$/, loader: "style!css!sass" },
            { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" },
            { test: /\.jsx$/, exclude: /node_modules/, loader: "jsx-loader?harmony" },
            { test: /\.json$/, loader: "json-loader" },
            { test: /\.jpe?g$|\.gif$|\.png$|\.svg$|\.woff$|\.ttf$|\.otf$/, loader: "url-loader" }
        ]
    },
    plugins: [
        //new UglifyJsPlugin()
    ]
};