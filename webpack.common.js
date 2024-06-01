module.exports = {
    entry: {
        "dist/sigmascript": "./src/sigmascript/index.ts",
        "dist/sigmascriptx": "./src/sigmascriptx/index.ts",
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