import { SigmaScript } from "..";
import { ASTElement } from "../../parser";

export interface Lib {
    use(variables: { [key: string]: string }, functions: { [key: string]: SigmaScript.Function }): void;
}

export class SigmaScriptLib implements Lib {
    private readonly program: ASTElement;

    constructor(program: ASTElement) {
        this.program = program;
    }

    use(variables: { [key: string]: string }, functions: { [key: string]: SigmaScript.Function }) {
        const scope = SigmaScript.execute(this.program);
        Object.assign(variables, scope.variables);
        Object.assign(functions, scope.functions);
    }
}

export class NativeLib implements Lib {
    private readonly variables: { [key: string]: string };
    private readonly functions: { [key: string]: SigmaScript.Function };

    constructor(variables: { [key: string]: string }, functions: { [key: string]: SigmaScript.Function }) {
        this.variables = variables;
        this.functions = functions;
    }

    use(variables: { [key: string]: string }, functions: { [key: string]: SigmaScript.Function }) {
        Object.assign(variables, this.variables);
        Object.assign(functions, this.functions);
    }
}