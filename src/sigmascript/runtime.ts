import { FnLib } from "./lib/fn";
import { JSLib } from "./lib/js";
import { SSFunction, Scope, SigmaScript } from "./sigmascript";

export class SigmaScriptRuntime {
    private readonly sigmaScript: SigmaScript;

    constructor(sigmaScript: SigmaScript) {
        this.sigmaScript = sigmaScript;
    }

    get libs() {
        return this.sigmaScript.libs;
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
        return this.sigmaScript.getLib(FnLib).addFn(fn);
    }

    print(value: string) {
        value = this.sigmaScript.getLib(JSLib).toJS(value);
        if (value === undefined)
            value = "unknown";
        console.log(value);
    }
}