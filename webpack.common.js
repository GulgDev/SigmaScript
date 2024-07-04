const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");

const ssConfig = {
    entry: {
        "dist/sigmascript": "./src/sigmascript/index.ts",
        "dist/sigmascriptx": "./src/sigmascriptx/index.ts",
        "dist/runtime/node": "./src/runtime/node.ts",
        "dist/runtime/browser": "./src/runtime/browser.ts",
        "dist/runtime/ssx": "./src/runtime/ssx.ts",
        "demo/index": "./src/demo.ts"
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    },
    output: {
        filename: "[name].js",
        path: __dirname
    }
};

const cliConfig = {
    target: "node",
    entry: "./src/bin.ts",
    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    },
    output: {
        filename: "bin/sigmascript.js",
        path: __dirname
    },
    optimization: {
        minimizer: [
            new TerserPlugin({
                extractComments: false
            })
        ]
    },
    plugins: [
        new webpack.BannerPlugin({
            banner: "#!/usr/bin/env node",
            raw: true
        }),
        new webpack.optimize.LimitChunkCountPlugin({
            maxChunks: 1
        })
    ]
}

module.exports = { ssConfig, cliConfig };