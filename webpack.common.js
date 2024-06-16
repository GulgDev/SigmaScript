module.exports = {
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