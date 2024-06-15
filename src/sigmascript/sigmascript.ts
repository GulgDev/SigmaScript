import { ASTElement, Grammar, Parser, inherit } from "../parser";
import { Lib, SigmaScriptLib } from "./lib";
import { grammar } from "./grammar";
import { SigmaScriptRuntime } from "./runtime";

export const MIME_TYPE = "text/sigmascript";

export interface Scope {
    readonly variables: { [key: string]: string };
    readonly functions: { [key: string]: SSFunction };
}

export type SSFunction = (...args: string[]) => string;

export class SigmaScript {
    private readonly parser: Parser;

    readonly runtime = new SigmaScriptRuntime(this);

    readonly libs: { [key: string]: Lib } = {};

    constructor(mergeGrammar: Partial<Grammar> = {}) {
        this.parser = new Parser(inherit(grammar, mergeGrammar));
    }

    /*private fnScope(scope: Scope, args: string[], params: string[]) {
        const localScope = this.newScope(scope);
        let i = 0;
        for (const param of params) {
            const arg = args[i];
            if (!arg) break;
            localScope.variables[param] = arg;
            ++i;
        }
        return localScope;
    }

    protected parseImports(imports: ASTElement, scope: Scope) {
        for (const use of imports)
            this.libs[use.find("name").value]?.use(scope);
    }

    protected parseString(raw: string) {
        return raw.slice(1, -1).replace(/\\\"/g, "\"").replace(/\\\\/g, "\\");
    }

    protected evalExpr(expr: ASTElement, scope: Scope): string {
        if (expr.name === "expr")
            expr = expr.first;
        switch (expr.name) {
            case "parenthesisexpr":
                return this.evalExpr(expr.first, scope);
            case "name":
                return scope.variables[expr.value] ?? "unknown";
            case "number":
            case "bool":
                return expr.value;
            case "string":
                return this.parseString(expr.value);
            case "neg": {
                const result = -Number.parseFloat(this.evalExpr(expr.first, scope));
                return Number.isNaN(result) ? "unknown" : `${result}`;
            }
            case "add": {
                const a = this.evalExpr(expr.first, scope);
                const b = this.evalExpr(expr.last, scope);
                const result = Number.parseFloat(a) + Number.parseFloat(b);
                return Number.isNaN(result) ? "unknown" : `${result}`;
            }
            case "sub": {
                const a = this.evalExpr(expr.first, scope);
                const b = this.evalExpr(expr.last, scope);
                const result = Number.parseFloat(a) - Number.parseFloat(b);
                return Number.isNaN(result) ? "unknown" : `${result}`;
            }
            case "mul": {
                const a = this.evalExpr(expr.first, scope);
                const b = this.evalExpr(expr.last, scope);
                const result = Number.parseFloat(a) * Number.parseFloat(b);
                return Number.isNaN(result) ? "unknown" : `${result}`;
            }
            case "div": {
                const a = this.evalExpr(expr.first, scope);
                const b = this.evalExpr(expr.last, scope);
                const result = Number.parseFloat(a) / Number.parseFloat(b);
                return Number.isNaN(result) ? "unknown" : `${result}`;
            }
            case "eq": {
                const a = this.evalExpr(expr.first, scope);
                const b = this.evalExpr(expr.last, scope);
                return `${a === b}`;
            }
            case "lt": {
                const a = Number.parseFloat(this.evalExpr(expr.first, scope));
                const b = Number.parseFloat(this.evalExpr(expr.last, scope));
                if (Number.isNaN(a) || Number.isNaN(b)) return "unknown";
                return `${a < b}`;
            }
            case "gt": {
                const a = Number.parseFloat(this.evalExpr(expr.first, scope));
                const b = Number.parseFloat(this.evalExpr(expr.last, scope));
                if (Number.isNaN(a) || Number.isNaN(b)) return "unknown";
                return `${a > b}`;
            }
            case "le": {
                const a = Number.parseFloat(this.evalExpr(expr.first, scope));
                const b = Number.parseFloat(this.evalExpr(expr.last, scope));
                if (Number.isNaN(a) || Number.isNaN(b)) return "unknown";
                return `${a <= b}`;
            }
            case "ge": {
                const a = Number.parseFloat(this.evalExpr(expr.first, scope));
                const b = Number.parseFloat(this.evalExpr(expr.last, scope));
                if (Number.isNaN(a) || Number.isNaN(b)) return "unknown";
                return `${a >= b}`;
            }
            case "or": {
                const a = this.evalExpr(expr.first, scope);
                const b = this.evalExpr(expr.last, scope);
                return `${a === "true" || b === "true"}`;
            }
            case "and": {
                const a = this.evalExpr(expr.first, scope);
                const b = this.evalExpr(expr.last, scope);
                return `${a === "true" && b === "true"}`;
            }
            case "not":
                return `${this.evalExpr(expr.first, scope) === "true" ? "false" : "true"}`;
            case "concat": {
                const a = this.evalExpr(expr.first, scope);
                const b = this.evalExpr(expr.last, scope);
                return a + b;
            }
            case "call": {
                const name = expr.find("name").value;
                const func = scope.functions[name];
                if (!func) return "unknown";
                const args = Array.from(expr.find("arglist")).map((arg) => this.evalExpr(arg, scope));
                return func(args);
            }
            case "lambda": {
                const body = expr.findChild("body");
                const retExpr = expr.findChild("expr");
                const params = Array.from(expr.find("paramlist")).map((param) => param.value);
                return this.getLib(FnLib).addFn((args: string[]) => {
                    const localScope = this.fnScope(scope, args, params);
                    return (body && this.exec(body, localScope)) ?? (retExpr && this.evalExpr(retExpr, localScope)) ?? "unknown";
                });
            }
        }
        return "unknown";
    }

    protected execStatement(statement: ASTElement, scope: Scope): string {
        switch (statement.name) {
            case "assign":
                scope.variables[statement.find("name").value] = this.evalExpr(statement.find("expr"), scope);
                break;
            case "if": {
                const condition = this.evalExpr(statement.find("expr"), scope);
                let result;
                if (condition === "true")
                    result = this.exec(statement.find("body"), scope);
                const elseStatement = statement.findChild("else");
                if (elseStatement && condition === "false")
                    result = this.exec(elseStatement.find("body"), scope);
                if (result) return result;
                break;
            }
            case "while": {
                const expr = statement.find("expr");
                const body = statement.find("body");
                while (this.evalExpr(expr, scope) === "true") {
                    const result = this.exec(body, scope);
                    if (result) return result;
                }
                break;
            }
            case "function": {
                const body = statement.find("body");
                const params = Array.from(statement.find("paramlist")).map((param) => param.value);
                scope.functions[statement.find("name").value] = (args: string[]) =>
                    this.exec(body, this.fnScope(scope, args, params)) ?? "unknown";
                break;
            }
            case "print":
                console.log(this.getLib(JSLib).toJS(this.evalExpr(statement.find("expr"), scope)) ?? "unknown");
                break;
            case "callstat":
                this.evalExpr(statement.first, scope);
                break;
            case "return":
                return this.evalExpr(statement.find("expr"), scope);
        }
    }*/

    private compileExpr(expr: ASTElement, depth: number): string {
        if (expr.name === "expr")
            expr = expr.first;
        switch (expr.name) {
            case "parenthesisexpr":
                return `(${this.compileExpr(expr.first, depth)})`;
            case "name":
                return `(scope${depth}.variables.${expr.value} ?? "unknown")`;
            case "number":
            case "bool":
                return `"${expr.value}"`;
            case "string":
                return expr.value;
            case "neg":
                return `\`\${-${this.compileExpr(expr.first, depth)}}\``;
            case "add":
                return `\`\${+${this.compileExpr(expr.first, depth)} + +${this.compileExpr(expr.last, depth)}}\``;
            case "sub":
                return `\`\${+${this.compileExpr(expr.first, depth)} - +${this.compileExpr(expr.last, depth)}}\``;
            case "mul":
                return `\`\${+${this.compileExpr(expr.first, depth)} * +${this.compileExpr(expr.last, depth)}}\``;
            case "div":
                return `\`\${+${this.compileExpr(expr.first, depth)} / +${this.compileExpr(expr.last, depth)}}\``;
            case "eq":
                return `\`\${${this.compileExpr(expr.first, depth)} === ${this.compileExpr(expr.last, depth)}}\``;
            case "lt":
                return `\`\${+${this.compileExpr(expr.first, depth)} < +${this.compileExpr(expr.last, depth)}}\``;
            case "gt":
                return `\`\${+${this.compileExpr(expr.first, depth)} > +${this.compileExpr(expr.last, depth)}}\``;
            case "le":
                return `\`\${+${this.compileExpr(expr.first, depth)} <= +${this.compileExpr(expr.last, depth)}}\``;
            case "ge":
                return `\`\${+${this.compileExpr(expr.first, depth)} >= +${this.compileExpr(expr.last, depth)}}\``;
            case "or":
                return `\`\${${this.compileExpr(expr.first, depth)} === "true" || ${this.compileExpr(expr.last, depth)} === "true"}\``;
            case "and":
                return `\`\${${this.compileExpr(expr.first, depth)} === "true" && ${this.compileExpr(expr.last, depth)} === "true"}\``;
            case "not":
                return `\`\${${this.compileExpr(expr.first, depth)} === "true" ? "false" : "true"}\``;
            case "concat":
                return `${this.compileExpr(expr.first, depth)} + ${this.compileExpr(expr.last, depth)}`;
            case "call":
                return `(${this.compileCall(expr, depth)} ?? "unknown")`;
            case "lambda":
                return `runtime.lambda(${
                    expr.findChild("expr") ?
                        this.compileLambda(expr, depth) :
                        this.compileFunction(expr, depth)
                })`;
        }
    }

    private compileCall(call: ASTElement, depth: number) {
        return `scope${depth}.functions.${call.find("name").value}?.(${
            Array.from(call.find("arglist")).map((arg) => this.compileExpr(arg, depth)).join(", ")
        })`;
    }

    private compileFunction(fn: ASTElement, depth: number) {
        const params = Array.from(fn.find("paramlist"));
        return `(${
            params.map((_, i) => `arg${i}`).join(", ")
        }) => {\n${
            this.localScope(++depth) +
            params.map((name, i) => `scope${depth}.variables.${name.value} = arg${i};\n`).join("") +
            this.compileBody(fn.find("body"), depth)
        }}`;
    }

    private compileLambda(fn: ASTElement, depth: number) {
        const params = Array.from(fn.find("paramlist"));
        return `(${
            params.map((_, i) => `arg${i}`).join(", ")
        }) => {\n${
            this.localScope(++depth) +
            params.map((name, i) => `scope${depth}.variables.${name.value} = arg${i};\n`).join("")
        }return ${
            this.compileExpr(fn.find("expr"), depth)
        };\n}`;
    }

    private compileStatement(statement: ASTElement, depth: number): string {
        switch (statement.name) {
            case "assign":
                return `scope${depth}.variables.${statement.find("name").value} = ${this.compileExpr(statement.find("expr"), depth)};`;
            case "if": {
                let result = `if ((${this.compileExpr(statement.find("expr"), depth)}) === "true") {\n${
                    this.compileBody(statement.find("body"), depth)
                }}`;
                const elseStatement = statement.findChild("else");
                if (elseStatement) {
                    result += `\nelse {\n${this.compileBody(elseStatement.find("body"), depth)}}`;
                }
                return result;
            }
            case "while": {
                return `while ((${this.compileExpr(statement.find("expr"), depth)}) === "true") {\n${
                    this.compileBody(statement.find("body"), depth)
                }}`;;
            }
            case "function":
                return `scope${depth}.functions.${statement.find("name").value} = ${this.compileFunction(statement, depth)};`;
            case "print":
                return `runtime.print(${this.compileExpr(statement.find("expr"), depth)});`;
            case "callstat":
                return this.compileCall(statement.first, depth) + ";";
            case "return":
                return `return ${this.compileExpr(statement.find("expr"), depth)};`;
        }
    }

    private compileBody(body: ASTElement, depth: number = 0): string {
        let result = "";
        for (const { first: statement } of body) {
            result += this.compileStatement(statement, depth) + "\n";
        }
        return result;
    }

    protected localScope(depth: number): string {
        return `const scope${depth} = { variables: { ...scope${depth - 1}.variables }, functions: { ...scope${depth - 1}.functions } };\n`;
    }

    protected globalScope(): string {
        return "const scope0 = runtime.scope();\n";
    }

    private compileImports(imports: ASTElement) {
        let result = "";
        for (const use of imports)
            result += `runtime.libs.${use.find("name").value}?.use(scope0);\n`;
        return result;
    }
    
    protected compileProgram(program: ASTElement): string {
        let result = this.globalScope();
        result += this.compileImports(program.find("imports"));
        result += this.compileBody(program.find("body"));
        result += "return scope0;\n";
        return result;
    }

    addLib(name: string, lib: Lib) {
        this.libs[name] = lib;
    }

    getLib<T extends Lib>(libClass: { new(...args: any): T }): T {
        return Object.values(this.libs).find((lib) => lib instanceof libClass) as T;
    }

    execute(program: ASTElement): Scope {
        return Function("runtime", this.compileProgram(program))(this.runtime);
    }

    compile(source: string) {
        const program = this.parser.parse(source);
        if (!program || program.end.offset !== source.length) return;
        return this.compileProgram(program);
    }

    load(source: string) {
        const program = this.parser.parse(source);
        if (!program || program.end.offset !== source.length) return;
        const lib = program.findChild("lib");
        if (lib)
            this.addLib(lib.find("name").value, new SigmaScriptLib(this, program));
        else
            return this.execute(program);
    }
}