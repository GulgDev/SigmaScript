const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

const devConfig = {
    mode: "development",
    devtool: "inline-source-map",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: {
                    loader: "ts-loader",
                    options: {
                        context: __dirname,
                        configFile: "tsconfig.dev.json"
                    }
                },
                exclude: /node_modules/
            }
        ]
    }
};

module.exports = [
    merge(common.ssConfig, devConfig),
    merge(common.cliConfig, devConfig)
];