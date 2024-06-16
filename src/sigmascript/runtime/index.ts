import { Lib, SigmaScriptLib } from "../lib";
import { FnLib } from "../lib/fn";
import { JSLib } from "../lib/js";
import { CompiledFunction, SSFunction, Scope } from "../sigmascript";

export class SigmaScriptRuntime {
    private readonly libs: { [key: string]: Lib } = {};

    addLib(name: string, lib: Lib) {
        return this.libs[name] = lib;
    }

    getLib<T extends Lib>(libClass: { new(...args: any): T }): T {
        return Object.values(this.libs).find((lib) => lib instanceof libClass) as T;
    }

    lib(name: string, func: CompiledFunction) {
        this.addLib(name, new SigmaScriptLib(this, func));
    }

    scope(parent?: Scope): Scope {
        const scope = { variables: {}, functions: {} };
        if (parent)
            this.copyScope(parent, scope);
        return scope;
    }

    copyScope(source: Scope, destination: Scope) {
        Object.assign(destination.variables, source.variables);
        Object.assign(destination.functions, source.functions);
    }

    lambda(fn: SSFunction) {
        return this.getLib(FnLib).addFn(fn);
    }

    print(value: string) {
        value = this.getLib(JSLib).toJS(value);
        if (value === undefined)
            value = "unknown";
        console.log(value);
    }
}