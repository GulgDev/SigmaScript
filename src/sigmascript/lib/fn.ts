import { SSFunction, Scope } from "../sigmascript";
import { NativeLib } from ".";
import { Registry } from "../registry";

export class FnLib extends NativeLib {
    private readonly registry = new Registry<SSFunction>("fn");

    readonly functions: Readonly<{ [key: string]: SSFunction }> = {
        fn: ([ name ], scope) => this.fn(name, scope),
        call: ([ fn, ...args ], scope) => this.call(fn, args, scope)
    };

    fn(name: string, scope: Scope) {
        return this.registry.add(scope.functions[name]);
    }

    call(fn: string, args: string[], scope: Scope) {
        return this.registry.get(fn)?.(args, scope) ?? "unknown";
    }
}