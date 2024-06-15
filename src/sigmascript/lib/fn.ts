import { SSFunction } from "../sigmascript";
import { NativeLib } from ".";
import { Registry } from "../registry";

export class FnLib extends NativeLib {
    private readonly registry = new Registry<SSFunction>("fn");

    readonly functions: Readonly<{ [key: string]: SSFunction }> = {
        call: (fn, ...args) => this.call(fn, args)
    };

    addFn(fn: SSFunction) {
        return this.registry.add(fn);
    }

    getFn(fn: string) {
        return this.registry.get(fn);
    }

    call(fn: string, args: string[]) {
        return this.registry.get(fn)?.(...args) ?? "unknown";
    }
}