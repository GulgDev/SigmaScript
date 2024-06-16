import { JSLib } from "./js";
import { DOMLib } from "./dom";

export class BrowserJSLib extends JSLib {
    readonly variables: Readonly<{ [key: string]: string }> = {
        js_window: this.registry.add(window)
    };

    protected toJSObject(value: string) {
        if (value.startsWith("#dom:")) return this.runtime.getLib(DOMLib).getElement(value);
        return super.toJSObject(value);
    }
}