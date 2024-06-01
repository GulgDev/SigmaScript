import { SSFunction, SigmaScript } from "../sigmascript";
import { ASTElement } from "../../parser";

export class SigmaScriptLib {
    private readonly program: ASTElement;

    constructor(program: ASTElement) {
        this.program = program;
    }

    use(sigmaScript: SigmaScript, variables: { [key: string]: string }, functions: { [key: string]: SSFunction }) {
        const scope = sigmaScript.execute(this.program);
        Object.assign(variables, scope.variables);
        Object.assign(functions, scope.functions);
    }
}

export class NativeLib {
    public readonly variables: Readonly<{ [key: string]: string }>;
    public readonly functions: Readonly<{ [key: string]: SSFunction }>;

    constructor(variables: { [key: string]: string }, functions: { [key: string]: SSFunction }) {
        this.variables = variables;
        this.functions = functions;
    }

    use(variables: { [key: string]: string }, functions: { [key: string]: SSFunction }) {
        Object.assign(variables, this.variables);
        Object.assign(functions, this.functions);
    }
}