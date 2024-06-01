import { ASTElement, Grammar, Parser, inherit } from "../parser";
import { SigmaScriptLib } from "./lib";
import { domLib } from "./lib/dom";
import { fnLib } from "./lib/fn";
import { jsLib } from "./lib/js";
import { refLib } from "./lib/ref";
import { grammar } from "./grammar";

export class Scope {
    readonly variables: { [key: string]: string } = {};
    readonly functions: { [key: string]: SSFunction } = {};

    constructor(scope?: Scope) {
        if (scope) {
            this.variables = { ...scope.variables };
            this.functions = { ...scope.functions };
        }
    }
};

export type SSFunction = (args: string[], scope: Scope) => string;

export class SigmaScript {
    private readonly parser: Parser;

    protected readonly libs: { [key: string]: SigmaScriptLib } = {};

    constructor(mergeGrammar: Partial<Grammar> = {}) {
        this.parser = new Parser(inherit(grammar, mergeGrammar));
    }

    protected parseImports(imports: ASTElement, scope: Scope) {
        for (const use of imports) {
            const name = use.find("name").value;
            if (name in this.libs) this.libs[name].use(this, scope);
            else
                switch (name) {
                    case "js":
                        jsLib.use(scope);
                        break;
                    case "dom":
                        domLib.use(scope);
                        break;
                    case "ref":
                        refLib.use(scope);
                        break;
                    case "fn":
                        fnLib.use(scope);
                        break;
                }
        }
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
            case "add": {
                const a = this.evalExpr(expr.first, scope);
                const b = this.evalExpr(expr.last, scope);
                const result = Number.parseInt(a) + Number.parseInt(b);
                return Number.isNaN(result) ? "unknown" : `${result}`;
            }
            case "sub": {
                const a = this.evalExpr(expr.first, scope);
                const b = this.evalExpr(expr.last, scope);
                const result = Number.parseInt(a) - Number.parseInt(b);
                return Number.isNaN(result) ? "unknown" : `${result}`;
            }
            case "mul": {
                const a = this.evalExpr(expr.first, scope);
                const b = this.evalExpr(expr.last, scope);
                const result = Number.parseInt(a) * Number.parseInt(b);
                return Number.isNaN(result) ? "unknown" : `${result}`;
            }
            case "div": {
                const a = this.evalExpr(expr.first, scope);
                const b = this.evalExpr(expr.last, scope);
                const result = ~~(Number.parseInt(a) / Number.parseInt(b));
                return Number.isNaN(result) ? "unknown" : `${result}`;
            }
            case "eq": {
                const a = this.evalExpr(expr.first, scope);
                const b = this.evalExpr(expr.last, scope);
                return `${a === b}`;
            }
            case "lt": {
                const a = Number.parseInt(this.evalExpr(expr.first, scope));
                const b = Number.parseInt(this.evalExpr(expr.last, scope));
                if (Number.isNaN(a) || Number.isNaN(b)) return "unknown";
                return `${a < b}`;
            }
            case "gt": {
                const a = Number.parseInt(this.evalExpr(expr.first, scope));
                const b = Number.parseInt(this.evalExpr(expr.last, scope));
                if (Number.isNaN(a) || Number.isNaN(b)) return "unknown";
                return `${a > b}`;
            }
            case "le": {
                const a = Number.parseInt(this.evalExpr(expr.first, scope));
                const b = Number.parseInt(this.evalExpr(expr.last, scope));
                if (Number.isNaN(a) || Number.isNaN(b)) return "unknown";
                return `${a <= b}`;
            }
            case "ge": {
                const a = Number.parseInt(this.evalExpr(expr.first, scope));
                const b = Number.parseInt(this.evalExpr(expr.last, scope));
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
                return func(args, scope);
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
                scope.functions[statement.find("name").value] = (args: string[]) => {
                    const localScope = this.newScope(scope);
                    let i = 0;
                    for (const param of params) {
                        const arg = args[i];
                        if (!arg) break;
                        localScope.variables[param] = arg;
                        ++i;
                    }
                    return this.exec(body, localScope) ?? "unknown";
                };
                break;
            }
            case "print":
                console.log(this.evalExpr(statement.find("expr"), scope));
                break;
            case "callstat":
                this.evalExpr(statement.first, scope);
                break;
            case "return":
                return this.evalExpr(statement.find("expr"), scope);
        }
    }
    
    protected exec(body: ASTElement, scope: Scope): string {
        for (const { first: statement } of body) {
            const result = this.execStatement(statement, scope);
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

    protected newScope(parent?: Scope): Scope {
        return new Scope(parent);
    }

    execute(program: ASTElement): Scope {
        const scope = this.newScope();
        this.parseImports(program.find("imports"), scope);
        this.exec(program.find("body"), scope);
        return scope;
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