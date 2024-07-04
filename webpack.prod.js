const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

const prodConfig = {
    mode: "production",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/
            }
        ]
    }
};

module.exports = [
    merge(common.ssConfig, prodConfig),
    merge(common.cliConfig, prodConfig)
];