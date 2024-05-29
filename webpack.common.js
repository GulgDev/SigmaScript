const path = require("path");

module.exports = {
    entry: {
        "sigmascript": "./src/index.ts",
        "demo/index": "./src/demo.ts"
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    },
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "dist")
    }
};