import { ASTElement, Grammar, Parser, inherit } from "../parser";
import { SigmaScriptLib } from "./lib/lib";
import { domLib } from "./lib/dom";
import { fnLib } from "./lib/fn";
import { jsLib } from "./lib/js";
import { refLib } from "./lib/ref";
import { grammar } from "./grammar";

export type Scope = {
    variables: { [key: string]: string },
    functions: { [key: string]: SSFunction }
};
export type SSFunction = (args: string[], scope: Scope) => string;

export class SigmaScript {
    private readonly parser: Parser;

    protected readonly libs: { [key: string]: SigmaScriptLib } = {};

    constructor(mergeGrammar: Partial<Grammar> = {}) {
        this.parser = new Parser(inherit(grammar, mergeGrammar));
    }

    protected parseImports(imports: ASTElement) {
        const variables: { [key: string]: string } = {};
        const functions: { [key: string]: SSFunction } = {};
        for (const use of imports) {
            const name = use.find("name").value;
            if (name in this.libs) this.libs[name].use(this, variables, functions);
            else
                switch (name) {
                    case "js":
                        jsLib.use(variables, functions);
                        break;
                    case "dom":
                        domLib.use(variables, functions);
                        break;
                    case "ref":
                        refLib.use(variables, functions);
                        break;
                    case "fn":
                        fnLib.use(variables, functions);
                        break;
                }
        }
        return { variables, functions };
    }

    protected parseString(raw: string) {
        return raw.slice(1, -1).replace(/\\\"/g, "\"").replace(/\\\\/g, "\\");
    }

    protected evalExpr(expr: ASTElement, variables: { [key: string]: string }, functions: { [key: string]: SSFunction }): string {
        if (expr.name === "expr")
            expr = expr.first;
        switch (expr.name) {
            case "parenthesisexpr":
                return this.evalExpr(expr.first, variables, functions);
            case "name":
                return variables[expr.value] ?? "unknown";
            case "number":
            case "bool":
                return expr.value;
            case "string":
                return this.parseString(expr.value);
            case "add": {
                const a = this.evalExpr(expr.first, variables, functions);
                const b = this.evalExpr(expr.last, variables, functions);
                const result = Number.parseInt(a) + Number.parseInt(b);
                return Number.isNaN(result) ? "unknown" : `${result}`;
            }
            case "sub": {
                const a = this.evalExpr(expr.first, variables, functions);
                const b = this.evalExpr(expr.last, variables, functions);
                const result = Number.parseInt(a) - Number.parseInt(b);
                return Number.isNaN(result) ? "unknown" : `${result}`;
            }
            case "mul": {
                const a = this.evalExpr(expr.first, variables, functions);
                const b = this.evalExpr(expr.last, variables, functions);
                const result = Number.parseInt(a) * Number.parseInt(b);
                return Number.isNaN(result) ? "unknown" : `${result}`;
            }
            case "div": {
                const a = this.evalExpr(expr.first, variables, functions);
                const b = this.evalExpr(expr.last, variables, functions);
                const result = ~~(Number.parseInt(a) / Number.parseInt(b));
                return Number.isNaN(result) ? "unknown" : `${result}`;
            }
            case "eq": {
                const a = this.evalExpr(expr.first, variables, functions);
                const b = this.evalExpr(expr.last, variables, functions);
                return `${a === b}`;
            }
            case "lt": {
                const a = Number.parseInt(this.evalExpr(expr.first, variables, functions));
                const b = Number.parseInt(this.evalExpr(expr.last, variables, functions));
                if (Number.isNaN(a) || Number.isNaN(b)) return "unknown";
                return `${a < b}`;
            }
            case "gt": {
                const a = Number.parseInt(this.evalExpr(expr.first, variables, functions));
                const b = Number.parseInt(this.evalExpr(expr.last, variables, functions));
                if (Number.isNaN(a) || Number.isNaN(b)) return "unknown";
                return `${a > b}`;
            }
            case "le": {
                const a = Number.parseInt(this.evalExpr(expr.first, variables, functions));
                const b = Number.parseInt(this.evalExpr(expr.last, variables, functions));
                if (Number.isNaN(a) || Number.isNaN(b)) return "unknown";
                return `${a <= b}`;
            }
            case "ge": {
                const a = Number.parseInt(this.evalExpr(expr.first, variables, functions));
                const b = Number.parseInt(this.evalExpr(expr.last, variables, functions));
                if (Number.isNaN(a) || Number.isNaN(b)) return "unknown";
                return `${a >= b}`;
            }
            case "or": {
                const a = this.evalExpr(expr.first, variables, functions);
                const b = this.evalExpr(expr.last, variables, functions);
                return `${a === "true" || b === "true"}`;
            }
            case "and": {
                const a = this.evalExpr(expr.first, variables, functions);
                const b = this.evalExpr(expr.last, variables, functions);
                return `${a === "true" && b === "true"}`;
            }
            case "not":
                return `${this.evalExpr(expr.first, variables, functions) === "true" ? "false" : "true"}`;
            case "concat": {
                const a = this.evalExpr(expr.first, variables, functions);
                const b = this.evalExpr(expr.last, variables, functions);
                return a + b;
            }
            case "call": {
                const name = expr.find("name").value;
                const func = functions[name];
                if (!func) return "unknown";
                const args = Array.from(expr.find("arglist")).map((arg) => this.evalExpr(arg, variables, functions));
                return func(args, { variables, functions });
            }
        }
        return "unknown";
    }

    protected execStatement(statement: ASTElement, variables: { [key: string]: string }, functions: { [key: string]: SSFunction }): string {
        switch (statement.name) {
            case "assign":
                variables[statement.find("name").value] = this.evalExpr(statement.find("expr"), variables, functions);
                break;
            case "if": {
                const condition = this.evalExpr(statement.find("expr"), variables, functions);
                let result;
                if (condition === "true")
                    result = this.exec(statement.find("body"), variables, functions);
                const elseStatement = statement.findChild("else");
                if (elseStatement && condition === "false")
                    result = this.exec(elseStatement.find("body"), variables, functions);
                if (result) return result;
                break;
            }
            case "while": {
                const expr = statement.find("expr");
                const body = statement.find("body");
                while (this.evalExpr(expr, variables, functions) === "true") {
                    const result = this.exec(body, variables, functions);
                    if (result) return result;
                }
                break;
            }
            case "function": {
                const body = statement.find("body");
                const params = Array.from(statement.find("paramlist")).map((param) => param.value);
                functions[statement.find("name").value] = (args: string[]) => {
                    const localVariables = {...variables};
                    const localFunctions = {...functions};
                    let i = 0;
                    for (const param of params) {
                        const arg = args[i];
                        if (!arg) break;
                        localVariables[param] = arg;
                        ++i;
                    }
                    return this.exec(body, localVariables, localFunctions) ?? "unknown";
                };
                break;
            }
            case "print":
                console.log(this.evalExpr(statement.find("expr"), variables, functions));
                break;
            case "callstat":
                this.evalExpr(statement.first, variables, functions);
                break;
            case "return":
                return this.evalExpr(statement.find("expr"), variables, functions);
        }
    }
    
    protected exec(body: ASTElement, variables: { [key: string]: string }, functions: { [key: string]: SSFunction }): string {
        for (const { first: statement } of body) {
            const result = this.execStatement(statement, variables, functions);
            if (result) return result;
        }
    }

    private async loadScript(script: HTMLScriptElement) {
        if (script.getAttribute("type") !== "text/sigmascript") return;
        let source;
        if (script.hasAttribute("src")) {
            const response = await fetch(script.getAttribute("src"));
            source = await response.text();
        } else
            source = script.innerText;
        this.load(source);
    }
    
    initLoader() {
        new MutationObserver((mutations) => {
            for (const mutation of mutations)
                if (mutation.type === "childList")
                    for (const node of mutation.addedNodes)
                        if (node instanceof HTMLScriptElement)
                            this.loadScript(node);
        }).observe(document, { childList: true, subtree: true });
        for (const script of document.getElementsByTagName("script"))
            this.loadScript(script);
    }

    execute(program: ASTElement): Scope {
        const { variables, functions } = this.parseImports(program.find("imports"));
        this.exec(program.find("body"), variables, functions);
        return { variables, functions };
    }

    load(source: string): Scope {
        const program = this.parser.parse(source);
        if (!program || program.end.offset !== source.length) return;
        const lib = program.findChild("lib");
        if (lib)
            this.libs[lib.find("name").value] = new SigmaScriptLib(program);
        else
            return this.execute(program);
    }
}