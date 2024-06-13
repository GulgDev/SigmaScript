import { JSLib } from "./js";

export class NodeJSLib extends JSLib {
    readonly variables: Readonly<{ [key: string]: string }> = {
        js_global: this.registry.add(globalThis)
    };
}