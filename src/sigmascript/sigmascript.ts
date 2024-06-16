import { ASTElement, Grammar, Parser, inherit } from "../parser";
import { SigmaScriptLib } from "./lib";
import { grammar } from "./grammar";
import { SigmaScriptRuntime } from "./runtime";

export const MIME_TYPE = "text/sigmascript";

export interface Scope {
    readonly variables: { [key: string]: string };
    readonly functions: { [key: string]: SSFunction };
}

export type SSFunction = (...args: string[]) => string;

export type CompiledFunction = (runtime: SigmaScriptRuntime) => Scope;

export class SigmaScript {
    private readonly parser: Parser;

    readonly runtime: SigmaScriptRuntime;

    constructor(runtime: SigmaScriptRuntime, mergeGrammar: Partial<Grammar> = {}) {
        this.runtime = runtime;
        this.parser = new Parser(inherit(grammar, mergeGrammar));
    }

    protected compileExpr(expr: ASTElement, depth: number): string {
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

    protected compileCall(call: ASTElement, depth: number) {
        return `scope${depth}.functions.${call.find("name").value}?.(${
            Array.from(call.find("arglist")).map((arg) => this.compileExpr(arg, depth)).join(", ")
        })`;
    }

    protected compileFunction(fn: ASTElement, depth: number) {
        const params = Array.from(fn.find("paramlist"));
        return `(${
            params.map((_, i) => `arg${i}="unknown"`).join(", ")
        }) => {\n${
            this.localScope(++depth) +
            params.map((name, i) => `scope${depth}.variables.${name.value} = arg${i};\n`).join("") +
            this.compileBody(fn.find("body"), depth)
        }return "unknown";\n}`;
    }

    protected compileLambda(fn: ASTElement, depth: number) {
        const params = Array.from(fn.find("paramlist"));
        return `(${
            params.map((_, i) => `arg${i}="unknown"`).join(", ")
        }) => {\n${
            this.localScope(++depth) +
            params.map((name, i) => `scope${depth}.variables.${name.value} = arg${i};\n`).join("")
        }return ${
            this.compileExpr(fn.find("expr"), depth)
        };\n}`;
    }

    protected compileStatement(statement: ASTElement, depth: number): string {
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
                }}`;
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

    protected compileBody(body: ASTElement, depth: number = 0): string {
        let result = "";
        for (const { first: statement } of body) {
            result += this.compileStatement(statement, depth) + "\n";
        }
        return result;
    }

    protected localScope(depth: number): string {
        return `const scope${depth} = runtime.scope(scope${depth - 1});\n`;
    }

    protected globalScope(): string {
        return "const scope0 = runtime.scope();\n";
    }

    protected compileImports(imports: ASTElement) {
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

    protected createFunction(program: ASTElement): CompiledFunction {
        return Function("runtime", this.compileProgram(program)) as CompiledFunction;
    }

    getLibName(source: string) {
        return this.parser.parse(source)?.findChild("lib")?.find("name")?.value;
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
        const func = this.createFunction(program);
        if (lib)
            this.runtime.addLib(lib.find("name").value, new SigmaScriptLib(this.runtime, func));
        else
            return func(this.runtime);
    }
}