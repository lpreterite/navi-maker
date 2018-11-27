const package = require("./package.json");
const path = require("path");
const VueLoaderPlugin = require("vue-loader/lib/plugin");

const config = {
    mode: "development",
    entry: "./src/index.js",
    output: {
        path: path.resolve(__dirname, "./dist"),
        filename: `${package.name}.js`
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src")
        }
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: "vue-loader"
            },
            {
                test: /\.js$/,
                loader: "babel-loader",
                exclude: /node_modules/
            }
        ]
    },
    plugins: [new VueLoaderPlugin()]
};

if (process.env.NODE_ENV === "umd") {
    config.optimization = { minimize: false };
    config.output.library = package.name;
    config.output.libraryTarget = "umd2";
    config.output.filename = `${package.name}.js`;
}
if (process.env.NODE_ENV === "umd:min") {
    config.mode = "production";
    config.output.library = package.name;
    config.output.libraryTarget = "umd2";
    config.output.filename = `${package.name}.min.js`;
}
if (process.env.NODE_ENV === "es") {
    config.output.library = package.name;
    config.output.libraryTarget = "commonjs2";
    config.output.filename = `${package.name}.es.js`;
}
if (process.env.NODE_ENV === "commonjs") {
    config.output.library = package.name;
    config.output.libraryTarget = "commonjs2";
    config.output.filename = `${package.name}.common.js`;
}
if (process.env.NODE_ENV === "test") {
    config.devtool = "eval-source-map"; //If you would to use breakpoint in vscode, then must be set devtool to "eval-source-map"
    config.output = Object.assign(config.output, {
        devtoolModuleFilenameTemplate: "[absolute-resource-path]",
    });
}

module.exports = config;