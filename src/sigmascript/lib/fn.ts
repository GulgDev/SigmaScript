import { SigmaScript } from "..";
import { NativeLib } from "./lib";

let funcId = -1;

const funcs: { [key: string]: SigmaScript.Function } = {};

export const fnLib = new NativeLib({}, {
    fn([ name ], { functions }) {
        const key = `#fn:${++funcId}`;
        funcs[key] = functions[name];
        return key;
    },
    call([ fn, ...args ], scope) {
        return funcs[fn]?.(args, scope) ?? undefined;
    }
});