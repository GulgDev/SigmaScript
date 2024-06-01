import { SSFunction } from "../sigmascript";
import { NativeLib } from ".";

let funcId = -1;

const funcs: { [key: string]: SSFunction } = {};

export const fnLib = new NativeLib({}, {
    fn([ name ], { functions }) {
        const key = `#fn:${++funcId}`;
        funcs[key] = functions[name];
        return key;
    },
    call([ fn, ...args ], scope) {
        return funcs[fn]?.(args, scope) ?? "unknown";
    }
});