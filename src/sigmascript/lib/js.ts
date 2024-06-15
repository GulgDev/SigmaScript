import { NativeLib } from ".";
import { Registry } from "../registry";
import { SSFunction, Scope } from "../sigmascript";
import { ArrayLib } from "./array";
import { DOMLib } from "./dom";
import { FnLib } from "./fn";
import { RefLib } from "./ref";
import { StructLib } from "./struct";

const ssSymbol = Symbol("ss");

export class JSLib extends NativeLib {
    protected readonly registry = new Registry<any>("js");

    readonly functions: Readonly<{ [key: string]: SSFunction }> = {
        js: (code) => this.js(code),
        js_get: (handle, property) => this.get(handle, property),
        js_set: (handle, property, value) => this.set(handle, property, value),
        js_new: (handle, ...args) => this.new(handle, args),
        js_object: () => this.toSS({}),
        js_array: () => this.toSS([]),
        js_call: (handle, ...args) => this.call(handle, args),
        js_call_method: (handle, method, ...args) => this.callMethod(handle, method, args)
    };
    
    getObject(handle: string): any {
        return this.registry.get(handle);
    }
    
    toJS(value: string): any {
        if (value.startsWith("#ref:")) return this.toJS(this.sigmaScript.getLib(RefLib).get(value));
        if (value === "unknown") return undefined;
        if (value === "false") return false;
        if (value === "true") return true;
        if (/^-?[0-9]+(\.[0-9]+)?$/.test(value)) return Number.parseFloat(value);
        let object: any;
        if (value.startsWith("#js:")) object = this.getObject(value);
        else if (value.startsWith("#fn")) {
            const fn = this.sigmaScript.getLib(FnLib).getFn(value);
            if (!fn) return undefined;
            object = (...args: any[]) => this.toJS(fn(
                ...args.map((arg) => this.toSS(arg))));
        }
        else if (value.startsWith("#struct:")) {
            const struct = this.sigmaScript.getLib(StructLib).getStruct(value);
            if (!struct) return undefined;
            object = {};
            for (const key in struct) object[key] = this.toJS(struct[key]);
        }
        else if (value.startsWith("#array:")) {
            const array = this.sigmaScript.getLib(ArrayLib).getArray(value);
            if (!array) return undefined;
            object = array.map((element) => this.toJS(element));
        }
        else if (value.startsWith("#dom:")) object = this.sigmaScript.getLib(DOMLib).getElement(value);
        else return value;
        Object.defineProperty(object, ssSymbol, { value, enumerable: false });
        return object;
    }
    
    toSS(value: any): string {
        const ssValue = value[ssSymbol];
        if (ssValue !== undefined) return ssValue;
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
        const value = this.toJS(handle)?.[property];
        if (value == null) return "unknown";
        return this.toSS(value);
    }

    set(handle: string, property: string, value: string) {
        const object = this.toJS(handle);
        if (object != null) object[property] = this.toJS(value);
        return "unknown";
    }

    new(handle: string, args: string[]) {
        const ctor = this.toJS(handle);
        if (ctor == null) return "unknown";
        const value = new ctor(...args.map((arg) => this.toJS(arg)));
        if (value == null) return "unknown";
        return this.toSS(value);
    }

    call(handle: string, args: string[]) {
        const value = this.toJS(handle)?.(...args.map((arg) => this.toJS(arg)));
        if (value == null) return "unknown";
        return this.toSS(value);
    }

    callMethod(handle: string, method: string, args: string[]) {
        const value = this.toJS(handle)?.[method]?.(...args.map((arg) => this.toJS(arg)));
        if (value == null) return "unknown";
        return this.toSS(value);
    }
};