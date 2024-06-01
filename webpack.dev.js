const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
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
});