import { NativeLib } from "./lib";

let refId = -1;

const refs: { [key: string]: string } = {};

export const refLib = new NativeLib({}, {
    ref([ initialValue ]) {
        const key = `#ref:${++refId}`;
        refs[key] = initialValue ?? "unknown";
        return key;
    },
    ref_set([ ref, value ]) {
        refs[ref] = value;
        return "unknown";
    },
    ref_get([ ref ]) {
        return refs[ref] ?? "unknown";
    }
});