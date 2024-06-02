import { NativeLib } from ".";
import { Registry } from "../registry";
import { SSFunction } from "../sigmascript";
import { DOMLib } from "./dom";
import { RefLib } from "./ref";
import { StructLib } from "./struct";

export class JSLib extends NativeLib {
    private readonly registry = new Registry<any>("js");

    readonly variables: Readonly<{ [key: string]: string }> = {
        js_window: this.registry.add(window)
    };
    readonly functions: Readonly<{ [key: string]: SSFunction }> = {
        js: ([ code ]) => this.js(code),
        js_get: ([ handle, property ]) => this.get(handle, property),
        js_set: ([ handle, property, value ]) => this.set(handle, property, value),
        js_new: ([ handle, ...args ]) => this.new(handle, args),
        js_object: () => this.toSS({}),
        js_array: () => this.toSS([]),
        js_call: ([ handle, ...args ]) => this.call(handle, args),
        js_call_method: ([ handle, method, ...args ]) => this.callMethod(handle, method, args)
    };
    
    getObject(handle: string): any {
        return this.registry.get(handle);
    }
    
    toJS(value: string): any {
        if (value.startsWith("#js:")) return this.getObject(value);
        if (value.startsWith("#struct:")) return this.sigmaScript.getLib(StructLib).getStruct(value);
        if (value.startsWith("#dom:")) return this.sigmaScript.getLib(DOMLib).getElement(value);
        if (value.startsWith("#ref:")) return this.toJS(this.sigmaScript.getLib(RefLib).get(value));
        if (value === "unknown") return undefined;
        if (value === "false") return false;
        if (value === "true") return true;
        const number = Number.parseInt(value);
        if (!Number.isNaN(number)) return number;
        return value;
    }
    
    toSS(value: any): string {
        if (typeof value === "string" || value instanceof String ||
            typeof value === "boolean" || value instanceof Boolean ||
            Number.isInteger(value)) return `${value}`;
        if (value == null || Number.isNaN(value)) return "unknown";
        return this.registry.add(value);
    }

    js(code: string) {
        return this.toSS(eval(code));
    }

    get(handle: string, property: string) {
        const value = this.getObject(handle)?.[property];
        if (value == null) return "unknown";
        return this.toSS(value);
    }

    set(handle: string, property: string, value: string) {
        const object = this.getObject(handle);
        if (object != null) object[property] = this.toJS(value);
        return "unknown";
    }

    new(handle: string, args: string[]) {
        const ctor = this.getObject(handle);
        if (ctor == null) return "unknown";
        const value = new ctor(...args.map((arg) => this.toJS(arg)));
        if (value == null) return "unknown";
        return this.toSS(value);
    }

    call(handle: string, args: string[]) {
        const value = this.getObject(handle)?.(...args.map((arg) => this.toJS(arg)));
        if (value == null) return "unknown";
        return this.toSS(value);
    }

    callMethod(handle: string, method: string, args: string[]) {
        const value = this.getObject(handle)?.[method]?.(...args.map((arg) => this.toJS(arg)));
        if (value == null) return "unknown";
        return this.toSS(value);
    }
};