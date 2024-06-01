import { SSFunction, Scope, SigmaScript } from "../sigmascript";
import { ASTElement } from "../../parser";

export class SigmaScriptLib {
    private readonly program: ASTElement;

    constructor(program: ASTElement) {
        this.program = program;
    }

    use(sigmaScript: SigmaScript, scope: Scope) {
        const libScope = sigmaScript.execute(this.program);
        Object.assign(scope.variables, libScope.variables);
        Object.assign(scope.functions, libScope.functions);
    }
}

export class NativeLib {
    public readonly variables: Readonly<{ [key: string]: string }>;
    public readonly functions: Readonly<{ [key: string]: SSFunction }>;

    constructor(variables: { [key: string]: string }, functions: { [key: string]: SSFunction }) {
        this.variables = variables;
        this.functions = functions;
    }

    use(scope: Scope) {
        Object.assign(scope.variables, this.variables);
        Object.assign(scope.functions, this.functions);
    }
}