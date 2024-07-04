import { SSFunction } from "../sigmascript";
import { JSLib } from "./js";

export class NodeJSLib extends JSLib {
    readonly variables: Readonly<{ [key: string]: string }> = {
        js_env: "node",
        js_global: this.registry.add(globalThis)
    };

    readonly functions: Readonly<{ [key: string]: SSFunction; }> = {
        ...this.functions,
        js_require: (path) => this.toSS(eval("require")(path))
    };
}