const package = require('./package.json')
const path = require('path')

const config = {
    entry: "./src/main.js",
    output: {
        path: path.resolve(__dirname, "./dist"),
        filename: `${package.name}.js`
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            }
        ]
    }
}

module.exports = (env, argv) => {
    if (process.env.NODE_ENV === "umd") {
        config.output.library = package.name;
        config.output.libraryTarget = "umd2";
        config.output.filename = `${package.name}.js`;
    }
    if (process.env.NODE_ENV === "umd:min") {
        config.output.library = package.name;
        config.output.libraryTarget = 'umd2';
        config.output.filename = `${package.name}.min.js`;
    }
    if (process.env.NODE_ENV === "es") {
        config.output.library = package.name;
        config.output.libraryTarget = "amd";
        config.output.filename = `${package.name}.es.js`;
    }
    if (process.env.NODE_ENV === "commonjs") {
        config.output.library = package.name;
        config.output.libraryTarget = "commonjs2";
        config.output.filename = `${package.name}.common.js`;
    }

    return config
    // if (process.env.NODE_ENV === 'test') {
    //     config.externals = [require('webpack-node-externals')()]
    //     config.devtool = 'eval' //If you would to use breakpoint in vscode, then must be set devtool to "eval"
    //     config.output = Object.assign(module.exports.output, {
    //         devtoolModuleFilenameTemplate: "[absolute-resource-path]",
    //         devtoolFallbackModuleFilenameTemplate: "[absolute-resource-path]?[hash]"
    //     });
    // }
}
