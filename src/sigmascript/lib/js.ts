import { NativeLib } from ".";

let objectId = -1;

const objects: { [key: string]: any } = {};

function saveObject(object: any): string {
    const key = `#js:${++objectId}`;
    objects[key] = object;
    return key;
}

function getObject(handle: string): any {
    return objects[handle];
}

function toJS(value: string): any {
    if (value.startsWith("#js:")) return getObject(value);
    if (value === "unknown") return undefined;
    if (value === "false") return false;
    if (value === "true") return false;
    const number = Number.parseInt(value);
    if (!Number.isNaN(number)) return number;
    return value;
}

function toSS(value: any): string {
    if (typeof value === "string" || value instanceof String ||
        typeof value === "boolean" || value instanceof Boolean ||
        Number.isInteger(value)) return `${value}`;
    if (value == null || Number.isNaN(value)) return "unknown";
    return saveObject(value);
}

export const jsLib = new NativeLib({
    js_window: saveObject(window)
}, {
    js([ code ]) {
        return toSS(eval(code));
    },
    js_get([ handle, property ]) {
        const value = getObject(handle)?.[property];
        if (value == null) return "unknown";
        return toSS(value);
    },
    js_set([ handle, property, value ]) {
        const object = getObject(handle);
        if (object != null) object[property] = toJS(value);
        return "unknown";
    },
    js_new([ handle, ...args ]) {
        const ctor = getObject(handle);
        if (ctor == null) return "unknown";
        const value = new ctor(...args.map(toJS));
        if (value == null) return "unknown";
        return toSS(value);
    },
    js_call([ handle, ...args ]) {
        const value = getObject(handle)?.(...args.map(toJS));
        if (value == null) return "unknown";
        return toSS(value);
    },
    js_call_method([ handle, method, ...args ]) {
        const value = getObject(handle)?.[method]?.(...args.map(toJS));
        if (value == null) return "unknown";
        return toSS(value);
    }
});