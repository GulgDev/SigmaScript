import { CompiledFunction, SSFunction, Scope } from "../sigmascript";
import { SigmaScriptRuntime } from "../runtime";

export interface Lib {
    use(scope: Scope): void;
}

export class SigmaScriptLib implements Lib {
    private readonly runtime: SigmaScriptRuntime;
    private readonly func: CompiledFunction;

    private result: Scope | null = null;

    constructor(runtime: SigmaScriptRuntime, func: CompiledFunction) {
        this.runtime = runtime;
        this.func = func;
    }

    use(scope: Scope) {
        this.runtime.copyScope(this.result ?? (this.result = this.func(this.runtime)), scope);
    }
}

export class NativeLib implements Lib {
    protected readonly runtime: SigmaScriptRuntime;

    readonly variables: Readonly<{ [key: string]: string }> = {};
    readonly functions: Readonly<{ [key: string]: SSFunction }> = {};

    constructor(runtime: SigmaScriptRuntime) {
        this.runtime = runtime;
    }

    use(scope: Scope) {
        Object.assign(scope.variables, this.variables);
        Object.assign(scope.functions, this.functions);
    }
}