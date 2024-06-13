import { JSLib } from "./js";

export class BrowserJSLib extends JSLib {
    readonly variables: Readonly<{ [key: string]: string }> = {
        js_window: this.registry.add(window)
    };
}