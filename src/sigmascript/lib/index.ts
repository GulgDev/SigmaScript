import { SSFunction, Scope, SigmaScript } from "../sigmascript";
import { ASTElement } from "../../parser";

export interface Lib {
    use(scope: Scope): void;
}

export class SigmaScriptLib implements Lib {
    private readonly sigmaScript: SigmaScript;
    private readonly program: ASTElement;

    private result: Scope | null = null;

    constructor(sigmaScript: SigmaScript, program: ASTElement) {
        this.sigmaScript = sigmaScript;
        this.program = program;
    }

    use(scope: Scope) {
        this.sigmaScript.runtime.copyScope(this.result ?? (this.result = this.sigmaScript.execute(this.program)), scope);
    }
}

export class NativeLib implements Lib {
    protected readonly sigmaScript: SigmaScript;

    readonly variables: Readonly<{ [key: string]: string }> = {};
    readonly functions: Readonly<{ [key: string]: SSFunction }> = {};

    constructor(sigmaScript: SigmaScript) {
        this.sigmaScript = sigmaScript;
    }

    use(scope: Scope) {
        Object.assign(scope.variables, this.variables);
        Object.assign(scope.functions, this.functions);
    }
}