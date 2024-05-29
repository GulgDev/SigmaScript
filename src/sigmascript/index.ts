import { ASTElement, Parser } from "../parser";
import { domLib } from "./lib/dom";
import { fnLib } from "./lib/fn";
import { jsLib } from "./lib/js";
import { SigmaScriptLib } from "./lib/lib";
import { refLib } from "./lib/ref";

export namespace SigmaScript {
    export type Scope = {
        variables: { [key: string]: string },
        functions: { [key: string]: Function }
    };
    export type Function = (args: string[], scope: Scope) => string;

    const parser = new Parser({
        "number": "%d+",
        "name": "[a-zA-Z_][a-zA-Z0-9_]+?",
        "string": "\"([^\"]|(\\\\)|(\\\"))+?\"",
        "bool": "(true)|(false)",
        "add": {
            pattern: "%expr %+ %expr",
            precedence: 5
        },
        "sub": {
            pattern: "%expr - %expr",
            precedence: 5
        },
        "mul": {
            pattern: "%expr * %expr",
            precedence: 6
        },
        "div": {
            pattern: "%expr / %expr",
            precedence: 6
        },
        "concat": {
            pattern: "%expr @ %expr",
            precedence: 1
        },
        "eq": {
            pattern: "%expr = %expr",
            precedence: 4
        },
        "lt": {
            pattern: "%expr < %expr",
            precedence: 4
        },
        "gt": {
            pattern: "%expr > %expr",
            precedence: 4
        },
        "le": {
            pattern: "%expr <= %expr",
            precedence: 4
        },
        "ge": {
            pattern: "%expr >= %expr",
            precedence: 4
        },
        "or": {
            pattern: "%expr %| %expr",
            precedence: 2
        },
        "and": {
            pattern: "%expr & %expr",
            precedence: 3
        },
        "not": "! %expr",
        "arglist": "(%expr( , %expr)+?)?",
        "call": "%name %( %arglist %)",
        "parenthesisexpr": "%( %expr %)",
        "expr": {
            pattern: "%parenthesisexpr|%number|%string|%bool|%name|%add|%sub|%mul|%div|%concat|%eq|%lt|%gt|%le|%ge|%or|%and|%not|%call",
            preservePrecedence: true
        },
        "assign": "%name = %expr;",
        "paramlist": "(%name( , %name)+?)?",
        "if": "if %expr { %body } %else?",
        "else": "else { %body }",
        "while": "while %expr { %body }",
        "function": "fn %name %( %paramlist %) { %body }",
        "return": "ret %expr;",
        "callstat": "%call;",
        "print": "print %expr;",
        "statement": "%assign|%if|%while|%function|%return|%callstat|%print",
        "body": "( %statement )+?",
        "use": "use %name;",
        "imports": "( %use )+?",
        "lib": "lib %name;",
        "root": "%lib? %imports %body"
    });

    const libs: { [key: string]: SigmaScriptLib } = {};

    function parseImports(imports: ASTElement) {
        const variables: { [key: string]: string } = {};
        const functions: { [key: string]: SigmaScript.Function } = {};
        for (const use of imports) {
            const name = use.find("name").value;
            if (name in libs) libs[name].use(variables, functions);
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

    function parseString(raw: string): string {
        return raw.slice(1, -1).replace(/\\\"/g, "\"").replace(/\\\\/g, "\\");
    }

    function evalExpr(expr: ASTElement, variables: { [key: string]: string }, functions: { [key: string]: SigmaScript.Function }): string {
        expr = expr.first;
        switch (expr.name) {
            case "parenthesisexpr":
                return evalExpr(expr.first, variables, functions);
            case "name":
                return variables[expr.value] ?? "unknown";
            case "number":
            case "bool":
                return expr.value;
            case "string":
                return parseString(expr.value);
            case "add": {
                const a = evalExpr(expr.first, variables, functions);
                const b = evalExpr(expr.last, variables, functions);
                const result = Number.parseInt(a) + Number.parseInt(b);
                return Number.isNaN(result) ? "unknown" : `${result}`;
            }
            case "sub": {
                const a = evalExpr(expr.first, variables, functions);
                const b = evalExpr(expr.last, variables, functions);
                const result = Number.parseInt(a) - Number.parseInt(b);
                return Number.isNaN(result) ? "unknown" : `${result}`;
            }
            case "mul": {
                const a = evalExpr(expr.first, variables, functions);
                const b = evalExpr(expr.last, variables, functions);
                const result = Number.parseInt(a) * Number.parseInt(b);
                return Number.isNaN(result) ? "unknown" : `${result}`;
            }
            case "div": {
                const a = evalExpr(expr.first, variables, functions);
                const b = evalExpr(expr.last, variables, functions);
                const result = ~~(Number.parseInt(a) / Number.parseInt(b));
                return Number.isNaN(result) ? "unknown" : `${result}`;
            }
            case "eq": {
                const a = evalExpr(expr.first, variables, functions);
                const b = evalExpr(expr.last, variables, functions);
                return `${a === b}`;
            }
            case "lt": {
                const a = Number.parseInt(evalExpr(expr.first, variables, functions));
                const b = Number.parseInt(evalExpr(expr.last, variables, functions));
                if (Number.isNaN(a) || Number.isNaN(b)) return "unknown";
                return `${a < b}`;
            }
            case "gt": {
                const a = Number.parseInt(evalExpr(expr.first, variables, functions));
                const b = Number.parseInt(evalExpr(expr.last, variables, functions));
                if (Number.isNaN(a) || Number.isNaN(b)) return "unknown";
                return `${a > b}`;
            }
            case "le": {
                const a = Number.parseInt(evalExpr(expr.first, variables, functions));
                const b = Number.parseInt(evalExpr(expr.last, variables, functions));
                if (Number.isNaN(a) || Number.isNaN(b)) return "unknown";
                return `${a <= b}`;
            }
            case "ge": {
                const a = Number.parseInt(evalExpr(expr.first, variables, functions));
                const b = Number.parseInt(evalExpr(expr.last, variables, functions));
                if (Number.isNaN(a) || Number.isNaN(b)) return "unknown";
                return `${a >= b}`;
            }
            case "or": {
                const a = evalExpr(expr.first, variables, functions);
                const b = evalExpr(expr.last, variables, functions);
                return `${a === "true" || b === "true"}`;
            }
            case "and": {
                const a = evalExpr(expr.first, variables, functions);
                const b = evalExpr(expr.last, variables, functions);
                return `${a === "true" && b === "true"}`;
            }
            case "not":
                return `${evalExpr(expr.first, variables, functions) === "true" ? "false" : "true"}`;
            case "concat": {
                const a = evalExpr(expr.first, variables, functions);
                const b = evalExpr(expr.last, variables, functions);
                return a + b;
            }
            case "call": {
                const name = expr.find("name").value;
                const func = functions[name];
                if (!func) return "unknown";
                const args = Array.from(expr.find("arglist")).map((arg) => evalExpr(arg, variables, functions));
                return func(args, { variables, functions });
            }
        }
        return "unknown";
    }
    
    function exec(body: ASTElement, variables: { [key: string]: string }, functions: { [key: string]: SigmaScript.Function }): string {
        for (const { first: statement } of body)
            switch (statement.name) {
                case "assign":
                    variables[statement.find("name").value] = evalExpr(statement.find("expr"), variables, functions);
                    break;
                case "if": {
                    const condition = evalExpr(statement.find("expr"), variables, functions);
                    let result;
                    if (condition === "true")
                        result = exec(statement.find("body"), variables, functions);
                    const elseStatement = statement.findChild("else");
                    if (elseStatement && condition === "false")
                        result = exec(elseStatement.find("body"), variables, functions);
                    if (result) return result;
                    break;
                }
                case "while": {
                    const expr = statement.find("expr");
                    const body = statement.find("body");
                    while (evalExpr(expr, variables, functions) === "true") {
                        const result = exec(body, variables, functions);
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
                        return exec(body, localVariables, localFunctions) ?? "unknown";
                    };
                    break;
                }
                case "print":
                    console.log(evalExpr(statement.find("expr"), variables, functions));
                    break;
                case "callstat":
                    evalExpr(statement, variables, functions);
                    break;
                case "return":
                    return evalExpr(statement.find("expr"), variables, functions);
            }
    }

    export function execute(program: ASTElement): Scope {
        const { variables, functions } = parseImports(program.find("imports"));
        exec(program.find("body"), variables, functions);
        return { variables, functions };
    }

    export function load(source: string): Scope {
        const program = parser.parse(source);
        if (!program || program.end.offset !== source.length) return;
        const lib = program.findChild("lib");
        if (lib)
            libs[lib.find("name").value] = new SigmaScriptLib(program);
        else
            return execute(program);
    }
}